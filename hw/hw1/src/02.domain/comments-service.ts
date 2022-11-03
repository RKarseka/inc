import { abstractRepository } from "../03.repositories/abstract-repository";
import { commentsCollection } from "../03.repositories/db";
import { ParsedQs } from "qs";

export interface IComment {
  id: string,
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string
  },
  createdAt: string
}

export const commentsService = {
  async getOneComment(id: string): Promise<IComment | null> {
    return await abstractRepository.getOne<IComment>(id, commentsCollection)
  },
  async editOwnComment(id: string, body: ParsedQs) {
    const notOwnComment = true
    if (notOwnComment) return 403
    const result = await abstractRepository.updateOne(id, {}, commentsCollection)
    return result ? 204 : 404
  },
  async delOwnComment(id: string) {
    const notOwnComment = true
    if (notOwnComment) return 403
    const result = await abstractRepository.deleteOne(id, commentsCollection)
    return result ? 204 : 404
  }
}