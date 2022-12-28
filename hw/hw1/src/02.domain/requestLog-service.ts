import {requestsLogRepository} from "../03.repositories/requestsLog-repository";

export interface IRequestInfoLog {
  ip: string,
  url: string,
  date: number,
  method: string
}

export const requestLogService = {
  async saveRequest(requestInfo: IRequestInfoLog) {
    return await requestsLogRepository.addRequestToLog(requestInfo)
  }
}