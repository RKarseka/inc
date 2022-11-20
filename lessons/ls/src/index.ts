import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express'
import bodyParser from "body-parser"
import {productsRouter} from "./routes/products-router";
import {addressesRouter} from "./routes/addresses-router";
import {runDb} from "./repositories/db";
import {emailRouter} from "./routes/email-router";

const port = process.env.PORT || 5000

// create express app
const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.use('/products', productsRouter)
app.use('/addresses', addressesRouter)
app.use('/email', emailRouter)

// app.listen(port, () => {
//   console.log(`Example app listening on port: ${ port }`)
// })

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
  })
}

startApp()