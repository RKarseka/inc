import 'dotenv/config'
import express, { NextFunction, Request, Response } from 'express'

const app = express()

const addHackerResponseHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.header('hacker', 'samurai')
  next()
}

app.use(addHackerResponseHeaders)

const newsRouter = express.Router()

newsRouter
  .get('/categories', (req: Request, res: Response) => {
    res.send(newsCategories)
  })

app.use('/articles', newsRouter)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${ process.env.PORT }`)
})

let newsCategories = [
  {id: 1, title: 'sport'},
  {id: 2, title: 'politics'},
  {id: 3, title: 'economic'}
]

/*
Представь, что ты хакер, случайно получил доступ к репозиторию друга и решил над ним подшутить.
Для этого добавил для всего приложения middleware addHackerResponseHeaders
Смысл шутки - оставить подпись хакера:
в респонс для каждого запроса нужно добавить http-заголовок hacker со значением samurai

В качестве ответа напишите 7 строку, добавляющую нужный заголовок
*/