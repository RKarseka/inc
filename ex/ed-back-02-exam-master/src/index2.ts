import 'dotenv/config'
import express, {Request, Response} from 'express'

const app = express()

const moneyBalanceRouter = express.Router()

moneyBalanceRouter
  .get('/bitcoins', (req: Request, res: Response) => {
    res.send({type: 'bitcoin', value: 20})
  })

app.use('/money-balance', moneyBalanceRouter)

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})

let newsCategories = [
  {id: 1, title: 'sport'},
  {id: 2, title: 'politics'},
  {id: 3, title: 'economic'}
]

/*
Что нужно написать вместо XXX, чтобы приложение возвращало баланс в биткоинах при get-запросе на
http://localhost:PORT/money-balance/bitcoins
*/