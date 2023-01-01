import { abstractRepository } from './abstract-repository'
import { requestsInfoLogCollection } from './db'
import { IRequestInfoLog } from '../02.domain/requestLog-service'

export const requestsLogRepository = {
  async addRequestToLog (requestInfo: IRequestInfoLog) {
    return await abstractRepository.insertOne(requestInfo, requestsInfoLogCollection)
  }
}
