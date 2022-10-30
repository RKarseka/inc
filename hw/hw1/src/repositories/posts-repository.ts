import { state } from "../state"
import { postsCollection } from "./db"


export interface IPost {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

interface getParams {
  id?: string,
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}

export const postsRepository = {
  async getAll({sortBy, sortDirection, pageNumber, pageSize, id}: getParams) {

    //*todo #any
    const sort: any = {}
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1
    const skip = (pageNumber - 1) * pageSize
    if(!sort.createdAt){
      sort.createdAt = sortDirection === 'asc' ? 1 : -1
    }
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
    return {
      id: newPost.id,
      title: newPost.title,
      shortDescription: newPost.shortDescription,
      content: newPost.content,
      blogId: newPost.blogId,
      blogName: newPost.blogName,
      createdAt: newPost.createdAt,
    }
  },

  async getOne(id: string) {
    return await postsCollection.findOne({id}, {projection: {_id: 0}})

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