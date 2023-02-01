import {Request, Response} from 'express'
import {ParsedQs} from 'qs'
import {ISearchFields, makeGetAllParams} from '../helpers/helpers'
import {blogsRepository} from '../03.repositories/blogs-repository'
import {postsRepository} from '../03.repositories/posts-repository'
import {commentsCollection, postsCollection} from '../03.repositories/db'
import {abstractRepository} from '../03.repositories/abstract-repository'
import {IComment, ICommentFormatted, TLikeStatus} from "./comments-service";
import {IUser, IUserShort} from "./users-service";
import {ObjectId} from "mongodb";

type TLike = {
  addedAt: string
  userId: string
  login: string
}

type TNewestLike = {
  addedAt: string
  userId: string
  login: string
}

export interface IPostRaw {
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
}

export interface IPost {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  likes: TLike[]
  dislikes: TLike[]
}

export interface IPostFormatted {
  id: string
  title: string
  shortDescription: string
  content: string
  blogId: string
  blogName: string
  createdAt: string
  extendedLikesInfo: {
    likesCount: number
    dislikesCount: number
    myStatus: TLikeStatus
    newestLikes: TNewestLike []
  }
}

// const isMyLike = function (this: { myId: string }, like: TLike) {
//   return like.userId === this.myId
// }

const isMyLike = (userId: string, posts: TLike[]) => posts.some(like => like.userId === userId)

const mapFnForPost = (userId: string) => {
  return (post: IPost): IPostFormatted => {
    const {id, title, shortDescription, content, blogId, blogName, createdAt, likes, dislikes} = post
    const likesCount = likes?.length || 0
    const dislikesCount = dislikes?.length || 0
    const myStatus =
      isMyLike(userId, post.likes) && 'Like' ||
      isMyLike(userId, post.dislikes) && 'Dislike' || 'None'
    const newestLikes = []
    return {
      id,
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt,
      extendedLikesInfo: {
        likesCount,
        dislikesCount,
        myStatus,
        newestLikes: []
      }
    }
  }
}


export const postsService = {
  async setPostLike(id: string, body: ParsedQs, {userId, login}: IUserShort) {
    const newLike = () => ({userId, login, addedAt: new Date().toISOString()})
    const likeStatus = body.likeStatus as TLikeStatus
    const post = await abstractRepository.getOne<IPost>(id, postsRepository)
    if (!post) return 404


    if (likeStatus === 'Like' && isMyLike(userId, post.likes)) return 204
    if (likeStatus === 'Dislike' && isMyLike(userId, post.dislikes)) return 204

    if (!post.likes) post.likes = []
    if (!post.dislikes) post.dislikes = []

    post.dislikes = post.dislikes.filter(i => i.userId !== userId)
    post.likes = post.likes.filter(i => i.userId !== userId)

    if (likeStatus === 'Like') {
      post.likes.push(newLike())
    }

    if (likeStatus === 'Dislike') {
      post.dislikes.push(newLike())
    }

    const result = await abstractRepository.updateOne(id, post, commentsCollection)
    return result ? 204 : 404


  },
  async getOnePost(id: string, userId: string): Promise<IPost | null> {
    return await abstractRepository.getOne<IPost>(id, postsCollection, mapFnForPost(userId))
  },
  async getAllPosts(query: ParsedQs) {
    const searchFields: Array<ISearchFields<IPost>> = []
    const params = makeGetAllParams(query, searchFields)
    return await abstractRepository.getAllFromCollectionPaginated<IPost>(params, postsCollection)
  },
  async createPost(userId: string, rawPost: IPostRaw) {
    const post = await postsRepository.create(rawPost)
    return post ? mapFnForPost(userId)(post) : 400
  }
}

// rest
export const createPost = async (req: Request, res: Response) => {
  const blog = await blogsRepository.getOne(req.params.blogId || req.body.blogId)
  if (blog == null) {
    return res.send(404)
  }
  res.status(201).send(await postsRepository.create({
    ...req.body,
    blogId: req.params.blogId || req.body.blogId,
    blogName: blog.name
  }))
}
