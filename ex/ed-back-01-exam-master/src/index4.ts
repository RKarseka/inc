import 'dotenv/config'
import express, {Request, Response} from 'express'

const app = express()

app.get('/books', (req: Request, res: Response) => {
  res.send(books) // fix this line
})

app.delete('/books/:id', (req: Request, res: Response) => {
  const index = books.findIndex(b => b.id === +req.params.id)
  if (index > -1) {
    const book = books.splice(index, 1)
    res.send(book)
  } else {
    res.send(404)
  }
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
Какой корректный метод, соответствующий логике хэндлера, нужно написать в 10 строке вместо XXX?
*/