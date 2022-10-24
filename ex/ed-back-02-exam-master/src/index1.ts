import 'dotenv/config'
import express, {Request, Response} from 'express'

const app = express()

const newsRouter = express.Router()

newsRouter
  .get('/categories', (req: Request, res: Response) => {
      res.send(newsCategories)
  })

app.use('/news', newsRouter)

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port: ${process.env.PORT}`)
})

let newsCategories = [
    {id: 1, title: 'sport'},
    {id: 2, title: 'politics'},
    {id: 3, title: 'economic'}
]

/*
В качестве ответа напишите исправленную версию 13-ой строки. Приложение должно возвращать категории при get-запросе
на http://localhost:PORT/news/categories
*/