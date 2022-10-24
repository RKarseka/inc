import 'dotenv/config'
import express, {NextFunction, Request, Response} from 'express'

const app = express()

let requestsCount = 0

const requestsCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  requestsCount++
  console.log(requestsCount)
next()
}

app.use(requestsCounterMiddleware)


const newsRouter = express.Router()

newsRouter
  .get('/categories', (req: Request, res: Response) => {
    res.send(newsCategories)
  })

app.use('/articles', newsRouter)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})

let newsCategories = [
  {id: 1, title: 'sport'},
  {id: 2, title: 'politics'},
  {id: 3, title: 'economic'}
]

/*
Что нужно написать в 11 строке, чтобы middleware работал правильно.
*/