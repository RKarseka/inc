import 'dotenv/config'
import express, {Request, Response} from 'express'

const app = express()

app.use(express.json())

app.post('/books', (req: Request, res: Response) => {
  let newBook = {
    id: +(new Date()),
    title: req.body.title,
    year: req.body.year
  }
  books.push(newBook)
  res.send(newBook)
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

/*
Что нужно написать вместо XXX, чтобы body содержал нужные значения.
body-parser подключать нельзя (подсказка: express "из коробки" имеет нужный middleware)
*/