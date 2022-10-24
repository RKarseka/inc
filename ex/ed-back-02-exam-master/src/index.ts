import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.get('/search/books/:term', (req: Request, res: Response) => {
  res.send(repository.findBooks(req.params.term))
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})

const repository = {
  findBooks(term: string) {
    term = term.toLowerCase()
    return books.filter(b => b.title.toLowerCase().indexOf(term) > -1)
  },
  updateBook(bookId: number, title: string, year: number) {
    const book = books.find(b => b.id === bookId)
    if (book) {
      book.title = title
      book.year = year
      return book
    } else {
      return null
    }
  }
}

let books = [
  {id: 1, title: 'Algorithms', year: 2020},
  {id: 2, title: 'SQL', year: 2021},
  {id: 3, title: 'CSS', year: 2019},
  {id: 4, title: 'JS', year: 2018},
  {id: 5, title: 'Back-end - Путь Самурая', year: 2022},
]

/*
Исправьте 10 строку, передав в res.send то, что нужно,
чтобы поиск книг работал корректно

Код в одну строку пишите, максимально коротко.

В качестве ответа дать строку целиком
*/