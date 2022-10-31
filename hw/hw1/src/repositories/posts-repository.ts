import { state } from "../state"
import { postsCollection } from "./db"
import { ObjectId } from "mongodb";


interface getParams {
  id?: string,
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}

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
  async getAll({sortBy, sortDirection, pageNumber, pageSize, id}: getParams) {
    const skip = (pageNumber - 1) * pageSize

    //*todo #any
    const sort: any = {}
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1
    // if(!sort.createdAt){
    //   sort.createdAt = sortDirection === 'asc' ? 1 : -1
    // }
    //*todo #any
    const filter: any = {}
    if (id) {
      filter.blogId = id
    }

    const totalCount = await postsCollection.countDocuments(filter)

    const items =
      await postsCollection
        .find(filter)
        .project({_id: 0})
        .sort(sort)
        .limit(pageSize)
        .skip(skip)
        .toArray()

    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      totalCount,
      pageSize,
      items
    }
  },
  async create({title, shortDescription, content, blogId, blogName}: IPost): Promise<IPost> {
    const newPost = {
      id: new ObjectId() + '',
      title,
      shortDescription,
      content,
      blogId,
      blogName,
      createdAt: new Date().toISOString(),
    }
    await postsCollection.insertOne(newPost)
    return newPost
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



