import 'dotenv/config'
import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import {body, validationResult} from 'express-validator'

const app = express()

app.use(bodyParser.json())

app.post('/books',
  body('title').trim(),
  body('year').toInt(),
  (req: Request, res: Response) => {
    res.send(req.body)
  })

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port: ${process.env.PORT}`)
})

/*
В 11 и 12 строке сделайте Sanitization: для title сделайте trim, а для year конвертацию в число

В качестве ответа дать изменённые 2 строки целиком (с запятыми на конце)
*/