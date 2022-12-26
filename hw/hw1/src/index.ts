import express from 'express'
import bodyParser from 'body-parser'
import {blogsRouter} from './01.routers/blogs-router'
import {testingRouter} from './01.routers/reset-router'
import {runDb} from './03.repositories/db'
import {postsRouter} from './01.routers/posts-router'
import {usersRouter} from './01.routers/users-router'
import {authRouter} from './01.routers/auth-router'
import {commentsRouter} from './01.routers/comments-router'
import {emailRouter} from './01.routers/email-router'
import cookieParser from "cookie-parser";
import {securityRouter} from "./01.routers/security-router";




const port = 3000
const app = express()

app.set('trust proxy', true)

app.use(bodyParser.urlencoded({
  extended: true
}))

// app.use(loggerMiddleware())
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/testing', testingRouter)
app.use('/comments', commentsRouter)
app.use('/auth', authRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/email', emailRouter)
app.use('/security', securityRouter)

const startApp = async () => {
  await runDb()
  app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
  })
}

startApp()
