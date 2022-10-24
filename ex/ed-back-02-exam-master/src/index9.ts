import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import {body, validationResult} from 'express-validator'

const app = express()

app.use(bodyParser.json())

app.post('/books',

  body('year').isNumeric(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    res.send(repository.createBook(req.body.title, +req.body.year))
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
  },
  createBook(title: string, year: number) {
    const book = {
      id: +(new Date()),
      title: title,
      year: year
    }
    books.push(book)
    return book
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
В 11 строке в одну строку добавьте один middleware от express-validation, проверяющий
year на то, является ли он числом

В качестве ответа дать строку целиком
*/