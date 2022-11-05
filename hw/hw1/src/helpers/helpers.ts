import {SortDirection, Filter} from "mongodb"
import {ParsedQs} from "qs";

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
  const sortBy = params.sortBy?.toString() || 'createdAt'
  const sortDirection = (params.sortDirection?.toString() || -1) as SortDirection
  const sort: { [sortField: string]: SortDirection } = {[sortBy]: sortDirection}
  if (!sort.createdAt) {
    sort.createdAt = -1
  }

  const filters: Filter<T> = {}


  for (const field of searchFields) {
    if (params[field.query]) {
      const filter: any = {[field.name]: {$regex: new RegExp(params[field.query]?.toString() || '', "i")}}
      if (filters['$or']) {
        filters['$or'].push(filter)
      } else {
        filters['$or'] = [filter]
      }
    }
  }

  // for (const field of searchFields) {
  //   const filter = {$regex: new RegExp(params[field.query]?.toString() || '', "i")}
  //   if (filter) {
  //     filters = {...filters, [field.name]: filter}
  //   }
  // }
  return {sort, pageNumber, pageSize, skip, filters}
}

// export const mapFnObj = <T>(properties: [keyof T], obj: T) => {
//   const newObject: { [name: string]: any } = {}
//   properties.forEach((key: keyof T) => {
//     newObject[key] = obj[key]
//   })
//   return newObject
// }