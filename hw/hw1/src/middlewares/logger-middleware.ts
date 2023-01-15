import {NextFunction, Request, Response} from 'express'
import {requestLogService} from '../02.domain/requestLog-service'

export const hotLog: any = {}
export const loggerMW = async (req: Request, res: Response, next: NextFunction) => {
  const method = req.method
  const headers= req.headers
  const body = JSON.stringify(req.body)
  const params = JSON.stringify(req.params)
  const ip = req.ip
  const url = req.originalUrl || req.baseUrl
  const date2 = new Date().getTime()
  const date = new Date().toISOString()
  await requestLogService.saveRequest({ip, url, date, method, body, params, headers})
  if (!hotLog[ip]) hotLog[ip] = {}
  if (!hotLog[ip][url]) hotLog[ip][url] = {}
  if (!hotLog[ip][url][method]) hotLog[ip][url][method] = []
  hotLog[ip][url][method].push(date2)

  hotLog[ip][url][method] = hotLog[ip][url][method].filter((reqDate: number) => date2 - reqDate <= 10000)

  if (hotLog[ip][url][method].length > 5) {
    res.sendStatus(429)
    return
  }

  next()
}
