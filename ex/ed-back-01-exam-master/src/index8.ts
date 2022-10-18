import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.get('/books', (req: Request, res: Response) => {
  res.send(books) // fix this line
})

app.put('/books/:id', (req: Request, res: Response) => {
  if (!req.body.title || req.body?.title.trim().length < 10) {
    res.status(400).send({title: "Title should contains 10 or more symbols"})
  }
  const book = books.find(b => b.id === +req.params.id)
  if (book) {
    book.title = req.body.title
    res.send(book)
  } else {
    res.send(401)
  }
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