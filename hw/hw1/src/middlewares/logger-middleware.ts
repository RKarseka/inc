import {NextFunction, Request, Response} from 'express'
import {requestLogService} from '../02.domain/requestLog-service'

export const hotLog: any = {}
export const loggerMW = async (req: Request, res: Response, next: NextFunction) => {
  const method = req.method
  const headers = req.headers
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

  if (hotLog[ip][url][method].length > 7) {
    res.sendStatus(429)
    return
  }

  next()
}

const b = {
  "pagesCount": 1,
  "page": 1,
  "pageSize": 10,
  "totalCount": 6,
  "items": [{
    "id": "65bff44330ca86a7c0d76116",
    "content": "length_21-weqweqweqwq",
    "commentatorInfo": {"userId": "65bff42430ca86a7c0d76099", "userLogin": "2118lg"},
    "createdAt": "2024-02-04T20:32:03.749Z",
    "likesInfo": {"likesCount": 1, "dislikesCount": 1, "myStatus": "None"}
  }, {
    "id": "65bff44330ca86a7c0d76113",
    "content": "length_21-weqweqweqwq",
    "commentatorInfo": {"userId": "65bff42430ca86a7c0d76099", "userLogin": "2118lg"},
    "createdAt": "2024-02-04T20:32:03.248Z",
    "likesInfo": {"likesCount": 1, "dislikesCount": 1, "myStatus": "None"}
  }, {
    "id": "65bff44230ca86a7c0d76110",
    "content": "length_21-weqweqweqwq",
    "commentatorInfo": {"userId": "65bff42430ca86a7c0d76099", "userLogin": "2118lg"},
    "createdAt": "2024-02-04T20:32:02.753Z",
    "likesInfo": {"likesCount": 4, "dislikesCount": 0, "myStatus": "None"}
  }, {
    "id": "65bff44230ca86a7c0d7610d",
    "content": "length_21-weqweqweqwq",
    "commentatorInfo": {"userId": "65bff42430ca86a7c0d76099", "userLogin": "2118lg"},
    "createdAt": "2024-02-04T20:32:02.304Z",
    "likesInfo": {"likesCount": 0, "dislikesCount": 1, "myStatus": "None"}
  }, {
    "id": "65bff44130ca86a7c0d7610a",
    "content": "length_21-weqweqweqwq",
    "commentatorInfo": {"userId": "65bff42430ca86a7c0d76099", "userLogin": "2118lg"},
    "createdAt": "2024-02-04T20:32:01.802Z",
    "likesInfo": {"likesCount": 2, "dislikesCount": 0, "myStatus": "None"}
  }, {
    "id": "65bff44130ca86a7c0d76107",
    "content": "length_21-weqweqweqwq",
    "commentatorInfo": {"userId": "65bff42430ca86a7c0d76099", "userLogin": "2118lg"},
    "createdAt": "2024-02-04T20:32:01.341Z",
    "likesInfo": {"likesCount": 2, "dislikesCount": 0, "myStatus": "None"}
  }]
}
