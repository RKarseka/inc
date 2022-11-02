// export const getAllFromCollection = async <T>(query: IGetParams, collection: Collection): Promise<IPagedRes<T>> => {
import { IGetParams } from "../helpers/helpers";

export interface IPagedRes<T> {
  pagesCount: number,
  page: number,
  totalCount: number,
  pageSize: number,
  items: T[]
}

export const abstractRepository = {
  async getAllFromCollection<T>(query: IGetParams<T>, collection: any): Promise<IPagedRes<T>> {
    const {skip, pageSize, pageNumber, filters, sort} = query
    const totalCount = await collection.countDocuments(filters)
    const items = await collection
      .find(filters)
      .project({_id: 0})
      .sort(sort)
      .limit(pageSize)
      .skip(skip)
      .toArray() as T[]
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      totalCount,
      pageSize,
      items
    }
  }
}