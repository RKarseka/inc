import {NextFunction, Request, Response} from "express";
import {requestLogService} from "../02.domain/requestLog-service";
import {differenceInSeconds} from "date-fns";

export const hotLog: any = {}
export const loggerMW = async (req: Request, res: Response, next: NextFunction) => {
  const method = req.method
  const ip = req.ip
  const url = req.baseUrl || req.originalUrl
  const date = new Date().getTime()
  await requestLogService.saveRequest({ip, url, date, method})

  if (!hotLog[ip]) hotLog[ip] = {}
  if (!hotLog[ip][url]) hotLog[ip][url] = {}
  if (!hotLog[ip][url][method]) hotLog[ip][url][method] = []
  hotLog[ip][url][method].push(date)

  hotLog[ip][url][method] = hotLog[ip][url][method].filter((reqDate: number) => date - reqDate <= 10000)

  if (hotLog[ip][url][method].length > 5) {
    res.sendStatus(429)
    return
  }

  next()
}
