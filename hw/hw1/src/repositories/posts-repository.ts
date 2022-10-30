import { state } from "../state";
import { blogsCollection, postsCollection } from "./db";
import { IBlog } from "./blogs-repository";

export interface IPost {
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

interface getParams {
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}

const {posts} = state
export const postsRepository = {
  async getAll({sortBy, sortDirection, pageNumber, pageSize}: getParams) {
    const sorts = [ 'createdAt' ]

    //*todo #any
    const sort: any = {}
    if (sorts.includes(sortBy)) {
      sort[sortBy] = sortDirection === 'asc' ? 1 : -1
    }
    const skip = (pageNumber - 1) * pageSize

    //*todo #any
    const filter: any = {}

    const itemsFull = await postsCollection.countDocuments(filter)

    const items =
      await postsCollection
        .find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip(skip)
        .toArray()

    return {
      pagesCount: Math.ceil(itemsFull / pageSize),
      page: pageNumber,
      itemsFull,
      pageSize,
      items
    }
  },
  async create({title, shortDescription, content, blogId}: IPost): Promise<IPost> {
    const newPost = {
      id: +(new Date()) + '',
      title,
      shortDescription,
      content,
      blogId,
      blogName: 'str',
      createdAt: new Date().toISOString(),
    }
    await postsCollection.insertOne(newPost)
    return newPost
  },

  async getOne(id: string) {
    return await blogsCollection.findOne({id})
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