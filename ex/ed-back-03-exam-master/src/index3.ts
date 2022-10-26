import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()

app.use(express.json())

app.put('/books/:id',
  async (req: Request, res: Response) => {
    const book = await repository.updateBook(+req.params.id, req.body.title, req.body.year)
    if (book) {
      res.send(book)
    } else {
      res.sendStatus(404)
    }
  })

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${ process.env.PORT }`)
})

const repository = {
  updateBook(bookId: number, title: string, year: number) {
    const promise = new Promise((res, rej) => {
      const book = books.find(b => b.id === bookId)
      if (book) {
        book.title = title
        book.year = year
        res(book)
      } else {
        res(null)
      }
    })
    return promise
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
В программе ошибка (случайно удалили строчку кода), из-за чего при обновлении книги обновлённая версия этой книги не возвращается назад.

Пофиксите проблему одной новой строкой кода.
В качестве ответа дать эту строку целиком.
*/