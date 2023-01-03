import {Request, Response, Router} from 'express'
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  usersCollection,
  usersSessionsCollection
} from '../03.repositories/db'
import {usersService} from "../02.domain/users-service";

export const testingRouter = Router({})
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await postsCollection.deleteMany({})
  await blogsCollection.deleteMany({})
  await usersCollection.deleteMany({})
  await commentsCollection.deleteMany({})
  await usersSessionsCollection.deleteMany({})
  res.sendStatus(204)
  await usersService.createUser({login: 'user', password: 'user', email: 'email'})
})
