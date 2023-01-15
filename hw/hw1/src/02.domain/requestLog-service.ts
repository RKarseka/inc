import { requestsLogRepository } from '../03.repositories/requestsLog-repository'
import {IncomingHttpHeaders} from "node:http";

export interface IRequestInfoLog {
  ip: string
  url: string
  date: string
  method: string
  body: string
  params: string
  headers: IncomingHttpHeaders
}

export const requestLogService = {
  async saveRequest (requestInfo: IRequestInfoLog) {
    return await requestsLogRepository.addRequestToLog(requestInfo)
  }
}
