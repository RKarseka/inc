import { state } from "../state";
import { blogsCollection } from "./db";

export interface IBlog {
  id: string,
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean
}

interface getParams {
  searchNameTerm: string | null,
  sortBy: string,
  sortDirection: string,
  pageNumber: number,
  pageSize: number
}

const {blogs} = state
export const blogsRepository = {
  async getAll({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize}: getParams) {
    const sorts = [ 'createdAt' ]

    //*todo #any
    const sort: any = {}
    if (sorts.includes(sortBy)) {
      sort[sortBy] = sortDirection === 'asc' ? 1 : -1
    }
    const skip = (pageNumber - 1) * pageSize
    //*todo #any
    const filter: any = {}
    if (searchNameTerm) {
      filter.name = {$regex: searchNameTerm}
    }
    const itemsFull = await blogsCollection.countDocuments(filter)
    const items =
      await blogsCollection
        .find(filter)
        .project({_id: 0})
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
  async create({name, description, websiteUrl}: IBlog): Promise<IBlog> {
    const newBlog = {
      id: +(new Date()) + '',
      name,
      description,
      websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false
    }
    await blogsCollection.insertOne(newBlog)
    return {
      id: newBlog.id,
      name: newBlog.name,
      description: newBlog.description,
      websiteUrl: newBlog.websiteUrl,
      createdAt: newBlog.createdAt,
      isMembership: newBlog.isMembership
    }
  },
  async getOne(id: string): Promise<IBlog | null> {
    return await blogsCollection.findOne({id})
  },
  async editOne(id: string, newBlog: IBlog): Promise<boolean> {
    const result = await blogsCollection.updateOne({id}, {$set: newBlog})
    return !!result.matchedCount
  },
  async deleteOne(id: string): Promise<boolean> {
    const result = await blogsCollection.deleteOne({id})
    return !!result.deletedCount
  }
}