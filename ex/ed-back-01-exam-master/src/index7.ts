import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.get('/books', (req: Request, res: Response) => {
  res.send(books)
})

app.post('/books', (req: Request, res: Response) => {
  let book = {
    id: +(new Date()),
    title: req.body.title,
    year: req.body.year
  }
  books.push(book)
  res.send(book)
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})

let books = [
  {id: 1, title: 'Algorithms', year: 2020},
  {id: 2, title: 'SQL', year: 2021},
  {id: 3, title: 'CSS', year: 2019},
  {id: 4, title: 'JS', year: 2018},
  {id: 5, title: 'Back-end - Путь Самурая', year: 2022},
]