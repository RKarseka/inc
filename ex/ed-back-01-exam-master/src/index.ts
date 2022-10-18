import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.json())

app.get('/news/categories', (req: Request, res: Response) => {
  res.send(newsCategories.map(c => ({ title: c.title })))
})

app.delete('/news/categories/:id', (req: Request, res: Response) => {
  newsCategories = newsCategories.filter(c => c.id !== +req.params.id)
  res.send(204)
})

app.put('/news/categories/:id', (req: Request, res: Response) => {
  for (const c of newsCategories) {
    if (c.id === +req.params.id) {
      c.title = req.body.title
      break;
    }
  }
  res.send(204)
})

app.get('/news/categories/:id', (req: Request, res: Response) => {
  res.send(newsCategories.find(c => c.id === +req.params.id))
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})
let newsCategories = [
  {id: 1, title: 'sport'},
  {id: 2, title: 'politics'},
  {id: 3, title: 'economic'}
]