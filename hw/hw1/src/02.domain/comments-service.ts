import { abstractRepository } from '../03.repositories/abstract-repository'
import { commentsCollection } from '../03.repositories/db'
import { ParsedQs } from 'qs'
import { IUserMe } from './users-service'
import { commentsRepository } from '../03.repositories/comments-repository'
import { postsRepository } from '../03.repositories/posts-repository'
import { ISearchFields, makeGetAllParams } from '../helpers/helpers'
import { NextFunction, Request, Response } from 'express'

export interface IComment {
  id: string
  content: string
  userId: string
  userLogin: string
  postId: string
  createdAt: string
}

export interface ICommentFormatted {
  id: string
  content: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: string
}

const mapFnForComment = ({ id, content, userId, userLogin, createdAt }: IComment): ICommentFormatted => (
  { id, content, commentatorInfo: { userId, userLogin }, createdAt })

export const commentsService = {
  async getOneComment (id: string): Promise<IComment | null> {
    return await abstractRepository.getOne<IComment>(id, commentsCollection, mapFnForComment)
  },
  async editOwnComment (id: string, content: ParsedQs, user: IUserMe) {
    const comment = await abstractRepository.getOne<IComment>(id, commentsCollection)
    if (user.id !== comment?.userId) { return 403 }
    const result = await abstractRepository.updateOne(id, content, commentsCollection)
    return result ? 204 : 404
  },
  async delOwnComment (id: string, user: IUserMe) {
    const comment = await abstractRepository.getOne<IComment>(id, commentsCollection)
    if (user.id !== comment?.userId) { return 403 }
    const result = await abstractRepository.deleteOne(id, commentsCollection)
    return result ? 204 : 404
  },
  async createComment (postId: string, content: string, user: IUserMe) {
    const post = await postsRepository.getOne(postId)
    if (post == null) {
      return 404
    }
    const comment = await commentsRepository.createComment(postId, content, user)
    if (comment != null) {
      return mapFnForComment(comment)
    }
    return 400
  },
  async getComments (query: ParsedQs, postId: string) {
    const post = await postsRepository.getOne(postId)
    if (post == null) return

    const searchFields: Array<ISearchFields<IComment>> = [{ name: 'postId', query: 'postId' }]
    const params = makeGetAllParams({ ...query, postId }, searchFields)
    return await abstractRepository.getAllFromCollectionPaginated<IComment>(params, commentsCollection, mapFnForComment)
  },
  async checkCommentPresent (req: Request, res: Response, next: NextFunction) {
    const comment = await abstractRepository.getOne<IComment>(req.params.id, commentsCollection)
    if (comment != null) {
      next()
    } else {
      res.sendStatus(404)
    }
  }
}
