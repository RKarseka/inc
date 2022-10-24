import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.get('/books', (req: Request, res: Response) => {
  res.send(books)
})

app.put('/books/:id', (req: Request, res: Response) => {
  const bookId = +req.params.id
  const book = repository.updateBook(bookId,req.body.title, req.body.year)
  if (book) {
    res.send(book)
  } else {
    res.sendStatus(401)
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})

const repository = {
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
В 15 строке напишите корректную версию (код в одну строку пишите), чтобы книга обновлялась корректно.
Данные для обновления (кроме id) берутся из body.

В качестве ответа дать строку целиком
*/