import { Request, Response, Router } from "express"
import { state } from "../state"

export const testingRouter = Router({})
const {videos, blogs} = state

testingRouter.delete('/all-data', (req: Request, res: Response) => {
  videos.length = 0
  blogs.length = 0
  res.sendStatus(204)
})