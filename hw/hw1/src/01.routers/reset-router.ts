import { Request, Response, Router } from "express"
import { blogsCollection, postsCollection } from "../03.repositories/db";

export const testingRouter = Router({})
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await postsCollection.deleteMany({})
  await blogsCollection.deleteMany({})
  res.sendStatus(204)
})