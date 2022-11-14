import {IGetParams} from "../helpers/helpers";
import {postsCollection} from "./db";

export interface IPagedRes<T> {
  pagesCount: number,
  page: number,
  totalCount: number,
  pageSize: number,
  items: T[]
}

export const mapFnDef = <T>(item: T): T => item

export const abstractRepository = {
// export const getAllFromCollection = async <T>(query: IGetParams, collection: Collection): Promise<IPagedRes<T>> => {
  async getAllFromCollection<T>(query: IGetParams<T>, collection: any, mapFn: any = mapFnDef<T>): Promise<IPagedRes<T>> {
    const {skip, pageSize, pageNumber, filters, sort} = query
    const totalCount = await collection.countDocuments(filters)
    const itemsRaw = await collection
      .find(filters)
      .project({_id: 0})
      .sort(sort)
      .limit(pageSize)
      .skip(skip)
      .toArray()
    const items = itemsRaw.map(mapFn)
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount,
      items
    }
  },
  async getOne<T>(id: string, collection: any, mapFn: any = mapFnDef <T>): Promise<T | null> {
    const item: T | null = await collection.findOne({id}, {projection: {_id: 0}})
    if (!item) return null
    return mapFn(item)
  },
  async updateOne(id: string, fields: any, collection: any) {
    const result = await collection.updateOne({id}, {$set: fields})
    return !!result.matchedCount
  },
  async deleteOne(id: string, collection: any) {
    const result = await collection.deleteOne({id})
    return !!result.deletedCount
  },
  async insertOne<T>(item: T, collection: any) {
    const result = await collection.insertOne(item)
    // @todo handle db response
    return !!result
  }
}