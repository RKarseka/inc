import 'dotenv/config'
import express, {Request, Response} from 'express'

const app = express()

app.use(express.json())

app.get('/books',
  async (req: Request<{},{},{},{term:string}>, res: Response) => {
      let books = await repository.findBooks(req.query.term)
      res.send(books)
  })

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port: ${process.env.PORT}`)
})

const repository = {
    async findBooks(term: string) {
        term = term.toLowerCase()
        return books.filter(b => b.title.toLowerCase().indexOf(term) > -1)
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
Почему-то не работает поиск. Исправьте ошибку.
В качестве ответа дайте полную исправленную строку
*/