import { postsCollection, usersCollection } from "./db"
import { ObjectId } from "mongodb";
import { getAllFromCollection, IGetParams, IPagedRes } from "../helpers/helpers";
import { IUser } from "../domain/users-service";


export interface IPost {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

const mapIPost = ({id, title, shortDescription, content, blogId, blogName, createdAt}: IPost): IPost => ({
  id, title, shortDescription, content, blogId, blogName, createdAt
})

export const postsRepository = {
  async getAll(query: IGetParams) {
    const res: IPagedRes<IPost> = await getAllFromCollection(query, postsCollection)
    return res
  },
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



