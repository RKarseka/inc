import {ObjectId} from 'mongodb'
import {IUserMe} from '../02.domain/users-service'
import {commentsCollection} from './db'
import {IPost} from '../02.domain/posts-service'
import {abstractRepository} from './abstract-repository'
import {IComment} from "../02.domain/comments-service";

const mapIComment = ({id, title, shortDescription, content, blogId, blogName, createdAt}: IPost): IPost => ({
  id, title, shortDescription, content, blogId, blogName, createdAt
})

export const commentsRepository = {
  async createComment(postId: string, content: string, user: IUserMe): Promise<IComment | undefined> {
    const newComment = {
      id: new ObjectId() + '',
      content,
      userId: user.id,
      userLogin: user.login,
      postId,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: []
    }
    const result = await abstractRepository.insertOne(newComment, commentsCollection)
    if (result) {
      return newComment
    }
  }
}
