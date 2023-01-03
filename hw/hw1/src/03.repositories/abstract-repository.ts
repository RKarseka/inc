import {IGetParams} from '../helpers/helpers'
import {Collection, Filter} from 'mongodb'

export interface IPagedRes<T> {
  pagesCount: number
  page: number
  totalCount: number
  pageSize: number
  items: T[]
}

export const mapFnDef = <T, D>(item: T): D => item as unknown as D

export const abstractRepository = {
  async getAllFromCollectionPaginated<T>(query: IGetParams<T>, collection: any, mapFn: any = mapFnDef<T, T>): Promise<IPagedRes<T>> {
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

  async getAllFromCollection<T>(filters: Filter<T>, collection: any) {
    return await collection
      .find(filters)
      .toArray()
  },

  async getOne<T>(value: string, collection: any, mapFn: any = mapFnDef <T, T>, name = 'id'): Promise<T | null> {
    const item: T | null = await collection.findOne({[name]: value}, {projection: {_id: 0}})
    if (!item) return null
    return mapFn(item)
  },
  async updateOne(filterValue: string, fields: any, collection: any, filter = 'id') {
    const result = await collection.updateOne({[filter]: filterValue}, {$set: fields})
    return !!result.matchedCount
  },
  async deleteOne(value: string, collection: any, field = 'id') {
    const result = await collection.deleteOne({[field]: value})
    return !!result.deletedCount
  },

  // @todo 2help
  async deleteMany<T extends Document>(filter: Filter<T>, collection: Collection<T>) {
    const result = await collection.deleteMany(filter)
    return !!result.deletedCount
  },
  async insertOne<T>(item: T, collection: any) {
    const result = await collection.insertOne(item)
    // @todo handle db response
    return !!result
  }
}
