import 'dotenv/config'
import express, { Request, Response } from 'express'


const app = express()

app.use(express.json())

app.delete('/books/:id',
  async (req: Request, res: Response) => {
    try {
      await repository.deleteBook(+req.params.id)
      res.sendStatus(204)
    } catch (error) {
      res.sendStatus(404) // not found
    }
  })

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${ process.env.PORT }`)
})

const repository = {
  deleteBook(id: number) {
    const promise = new Promise<void>((resolve, reject) => {
      const index = books.findIndex(b => b.id === id)
      if (index > -1) {
        books.splice(index, 1)
        resolve()
      } else {
        reject()
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
При попытке удалить книгу, которой нет в репозитории, клиент, сделавший запрос - зависает.
А мы хотим, чтобы сработал try-catch и клиенту улетел 404 статус.

В коде нужно дописать одну новую строку.

В качестве ответа дать эту строку целиком.
*/
