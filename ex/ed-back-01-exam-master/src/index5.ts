import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()

app.get('/books/:bookId', (req: Request, res: Response) => {
  res.send(books.find(b => b.id === +req.params.bookId)) // fix this line
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${ process.env.PORT }`)
})

let books = [
  {id: 1, title: 'Algorithms', year: 2020},
  {id: 2, title: 'SQL', year: 2021},
  {id: 3, title: 'CSS', year: 2019},
  {id: 4, title: 'JS', year: 2018},
  {id: 5, title: 'Back-end - Путь Самурая', year: 2022},
]

/*
Что нужно написать в 7 строке вместо XXX, чтобы на клиент улетела нужная книга?
*/