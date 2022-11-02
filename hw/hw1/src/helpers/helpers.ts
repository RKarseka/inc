import { Collection, SortDirection } from "mongodb"
import { ParsedQs } from "qs";

export interface IGetParams {
  sort: {
    [sortField: string]: SortDirection
  },
  pageNumber: number,
  pageSize: number,
  skip: number,
  filter: IFilter
}

interface IFilter {
  [fieldName: string]: {
    $regex: RegExp
  }
}

export interface IPagedRes<T> {
  pagesCount: number,
  page: number,
  totalCount: number,
  pageSize: number,
  items: T[]
}

export const makeGetAllParams = (query: ParsedQs, searchFields: string[]): IGetParams => {
  const pageNumber = +(query.pageNumber || 1)
  const pageSize = +(query.pageSize || 10)
  const skip = (pageNumber - 1) * pageSize
  const sort: {[sortField: string]: SortDirection} = {}
  const sortDirection = query.sortDirection?.toString() as SortDirection
  if (query.sortBy) {
    sort[query.sortBy?.toString()] = sortDirection
  }
  if (query.sortBy?.toString() !== 'createdAt') {
    sort.createdAt = -1
  }
  const filter: IFilter = {}
  searchFields.forEach((fieldName: string) => {
    filter[fieldName] = {$regex: new RegExp(query[fieldName]?.toString() || '', "i")}
  })
  return {sort, pageNumber, pageSize, skip, filter}
}


export const getAllFromCollection = async <T>(query: IGetParams, collection: Collection): Promise<IPagedRes<T>> => {
  const {skip, pageSize, pageNumber, filter, sort} = query
  const totalCount = await collection.countDocuments(filter)
  const items = await collection
    .find(filter)
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