import express from 'express'
import bodyParser from "body-parser"
import { blogsRouter } from "./routers/blogs-router"
import { testingRouter } from "./routers/reset-router"
import { postsRouter } from "./routers/posts-router";
import { runDb } from "./repositories/db";

const port = 3000
const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port: ${ port }`)
  })
}

startApp()