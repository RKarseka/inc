import {abstractRepository} from '../03.repositories/abstract-repository'
import {commentsCollection} from '../03.repositories/db'
import {ParsedQs} from 'qs'
import {IUserMe, IUserShort} from './users-service'
import {commentsRepository} from '../03.repositories/comments-repository'
import {postsRepository} from '../03.repositories/posts-repository'
import {ISearchFields, makeGetAllParams} from '../helpers/helpers'
import {NextFunction, Request, Response} from 'express'

export type TLikeStatus = 'Like' | 'Dislike' | 'None'

export interface ICommentBase {
  id: string
  content: string
  userId: string
  userLogin: string
  postId: string
  createdAt: string,
  likes: [string],
  dislikes: [string]
}

export interface IComment {
  id: string
  content: string
  userId: string
  userLogin: string
  postId: string
  createdAt: string,
  likes: string[],
  dislikes: string[]
}

export interface ICommentFormatted {
  id: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: string,
  likesInfo: {
    likesCount: number,
    dislikesCount: number,
    myStatus: TLikeStatus
  }
}

const mapFnForComment = (myId: string) => {
  return (comment: IComment): ICommentFormatted => {
    const {id, content, userId, userLogin, createdAt, likes, dislikes} = comment
    const likesCount = likes?.length || 0
    const dislikesCount = dislikes?.length || 0
    const myStatus = likes?.includes(myId) && 'Like' || dislikes?.includes(myId) && 'Dislike' || 'None'
    return {
      id,
      content,
      commentatorInfo: {userId, userLogin},
      createdAt,
      likesInfo: {likesCount, dislikesCount, myStatus}
    }
  }
}

export const commentsService = {
  async getOneComment(id: string, userId: string): Promise<IComment | null> {
    return await abstractRepository.getOne<IComment>(id, commentsCollection, mapFnForComment(userId))
  },
  async editOwnComment(id: string, content: ParsedQs, user: IUserMe) {
    const comment = await abstractRepository.getOne<IComment>(id, commentsCollection)
    if (user.id !== comment?.userId) {
      return 403
    }
    const result = await abstractRepository.updateOne(id, content, commentsCollection)
    return result ? 204 : 404
  },
  async delOwnComment(id: string, user: IUserMe) {
    const comment = await abstractRepository.getOne<IComment>(id, commentsCollection)
    if (user.id !== comment?.userId) {
      return 403
    }
    const result = await abstractRepository.deleteOne(id, commentsCollection)
    return result ? 204 : 404
  },
  async createComment(postId: string, content: string, user: IUserShort) {
    const post = await postsRepository.getOne(postId)
    if (post == null) {
      return 404
    }
    const comment: IComment | undefined = await commentsRepository.createComment(postId, content, user)
    if (comment) {
      return mapFnForComment(user.userId)(comment)
    }
    return 400
  },
  async getComments(query: ParsedQs, postId: string, userId: string) {
    const post = await postsRepository.getOne(postId)
    if (post == null) return

    const searchFields: Array<ISearchFields<IComment>> = [{name: 'postId', query: 'postId'}]
    const params = makeGetAllParams({...query, postId}, searchFields)
    return await abstractRepository.getAllFromCollectionPaginated<IComment>(params, commentsCollection, mapFnForComment(userId))
  },
  async checkCommentPresent(req: Request, res: Response, next: NextFunction) {
    const comment = await abstractRepository.getOne<IComment>(req.params.id, commentsCollection)
    if (comment != null) {
      next()
    } else {
      res.sendStatus(404)
    }
  },

  async setCommentLike(id: string, body: ParsedQs, userId: string) {
    const likeStatus = body.likeStatus as TLikeStatus
    const comment = await abstractRepository.getOne<IComment>(id, commentsCollection)

    if (!comment) return 404

    if (likeStatus === 'Like' && comment.likes.includes(userId)) return 204
    if (likeStatus === 'Dislike' && comment.dislikes.includes(userId)) return 204

    if (!comment.likes) comment.likes = []
    if (!comment.dislikes) comment.dislikes = []

    comment.dislikes = comment.dislikes.filter(i => i !== userId)
    comment.likes = comment.likes.filter(i => i !== userId)

    if (likeStatus === 'Like') {
      comment.likes.push(userId)
    }

    if (likeStatus === 'Dislike') {
      comment.dislikes.push(userId)
    }

    const result = await abstractRepository.updateOne(id, comment, commentsCollection)
    return result ? 204 : 404

  }
}
