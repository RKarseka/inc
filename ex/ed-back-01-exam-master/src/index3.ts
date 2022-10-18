import 'dotenv/config'
import express, { Request, Response } from 'express'

const app = express()

app.get('/books', (req: Request, res: Response) => {
  res.send(books) // remove this line and write correct version
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

7 строка неправильная. Что нужно написать в 7 строке, чтобы на клиент улетел массив книг?

В ответ напишите полностью переписанную строку (без комментария).

*/