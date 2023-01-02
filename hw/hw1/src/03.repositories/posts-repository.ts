import {postsCollection} from './db'
import {ObjectId} from 'mongodb'
import {IPost, IPostRaw} from '../02.domain/posts-service'


export const postsRepository = {
  async create({title, shortDescription, content, blogId, blogName}: IPostRaw): Promise<IPost | undefined> {
    const newPost = {
      id: new ObjectId() + '',
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
      likes: [],
      dislikes: []
    }
    const result = await postsCollection.insertOne(newPost)
    if (result) {
      return newPost
    }
  },

  async getOne(id: string) {
    return await postsCollection.findOne({id})
  },
  async editOne(id: string, newBlog: IPost): Promise<boolean> {
    const result = await postsCollection.updateOne({id}, {$set: newBlog})
    return !!result.matchedCount
  },
  async deleteOne(id: string): Promise<boolean> {
    const result = await postsCollection.deleteOne({id})
    return !!result.deletedCount
  }
}
