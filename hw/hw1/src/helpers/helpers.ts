import { SortDirection, Filter } from "mongodb"
import { ParsedQs } from "qs";

export type ISearchFields<T> = {
  name: keyof T,
  query: string
  // [searchField in keyof T]?: string
}

export interface IGetParams<T> {
  sort: {
    [sortField: string]: SortDirection
  },
  pageNumber: number,
  pageSize: number,
  skip: number,
  filters: Filter<T>
}


export const makeGetAllParams = <T>(params: ParsedQs, searchFields: ISearchFields<T>[]): IGetParams<T> => {
  const pageNumber = +(params.pageNumber || 1)
  const pageSize = +(params.pageSize || 10)
  const skip = (pageNumber - 1) * pageSize
  const sort: {[sortField: string]: SortDirection} = {}
  const sortDirection = params.sortDirection?.toString() as SortDirection
  if (params.sortBy) {
    sort[params.sortBy?.toString()] = sortDirection
  }
  if (params.sortBy?.toString() !== 'createdAt') {
    sort.createdAt = -1
  }
  let filters: Filter<T> = {}

  for (const field of searchFields) {
    const filter = {$regex: new RegExp(params[field.query]?.toString() || '', "i")}
    if (filter) {
      filters = {...filters, [field.name]: filter}
    }
  }
  return {sort, pageNumber, pageSize, skip, filters}
}


