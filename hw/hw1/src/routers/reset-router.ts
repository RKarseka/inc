import { Request, Response, Router } from "express"
import { state } from "../state"
import { blogsCollection, db, postsCollection } from "../repositories/db";

export const testingRouter = Router({})
testingRouter.delete('/all-data', async (req: Request, res: Response) => {
  await postsCollection.deleteMany({})
  await blogsCollection.deleteMany({})
  res.sendStatus(204)
})