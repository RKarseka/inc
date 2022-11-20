import {Request, Response, Router} from "express"
import {emailAdapter} from "../adapters/email-adapter";

export const emailRouter = Router({})

emailRouter.post('/send', async (req: Request, res: Response) => {
  await emailAdapter.sendEmail(req.body.email, req.body.message, req.body.subject)




    res.send({
      email: req.body.email,
      message: req.body.message,
      subject: req.body.subject
    })
  })