import {NextFunction, Request, Response} from "express";
import {requestLogService} from "../02.domain/requestLog-service";
import {differenceInSeconds} from "date-fns";

export const loggerMiddleware = () => {
  const hotLog: any = {}

  return async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method
    const ip = req.ip
    const url = req.baseUrl || req.originalUrl
    const date = new Date()


    const condition = hotLog[ip] && hotLog[ip].hasOwnProperty(url) && differenceInSeconds(date, hotLog[ip][url]) <= 10

    await requestLogService.saveRequest({ip, url, date, condition, method})

    if (!hotLog[ip]) {
      hotLog[ip] = {}
    }
    if(!hotLog[ip][url]) hotLog[ip][url]={}
    hotLog[ip][url][method] = date

    if (condition) {
      res.sendStatus(429)
      return
    }

    next()
  }
}