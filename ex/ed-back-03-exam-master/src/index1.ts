import 'dotenv/config'
import express, {Request, Response} from 'express'

const app = express()

app.use(express.json())

app.post('/books',
  async (req: Request, res: Response) => {
      const book = await repository.createBook(req.body.title, req.body.year)
      res.send(book)
  })

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port: ${process.env.PORT}`)
})

const repository = {
    async createBook(title: string, year: number) {
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
Книга создаётся, но возвращается почему-то пустой объект. Исправьте ошибку. В качестве ответа дайте
полную исправленную строку
*/
