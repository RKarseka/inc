import { Request, Response, Router } from 'express'
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
  usersSessionsCollection
} from '../03.repositories/db'

export const testingRouter = Router({})
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await postsCollection.deleteMany({})
  await blogsCollection.deleteMany({})
  await usersCollection.deleteMany({})
  await commentsCollection.deleteMany({})
  await usersSessionsCollection.deleteMany({})
  res.sendStatus(204)
})
