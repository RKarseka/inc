import { postsCollection } from "./db"
import { ObjectId } from "mongodb";
import { IPost } from "../domain/posts-service"

const mapIPost = ({id, title, shortDescription, content, blogId, blogName, createdAt}: IPost): IPost => ({
  id, title, shortDescription, content, blogId, blogName, createdAt
})

export const postsRepository = {
  async create({title, shortDescription, content, blogId, blogName}: IPost): Promise<IPost> {
    const newPost = {
      id: new ObjectId() + '',
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString()
    }
    await postsCollection.insertOne(newPost)
    return mapIPost(newPost)
  },

  async getOne(id: string) {
    const item = await postsCollection.findOne({id})
    return item ? mapIPost(item) : item


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



