import { Router, Request, Response } from 'express'
import { emailAdapter } from '../-adapters/email-adapter'

export const emailRouter = Router({})
emailRouter
  .post('/send', async (req: Request, res: Response) => {
    const info = 'info' // await emailAdapter.sendEmail(req.body.email, req.body.subject, req.body.message)
    res.send({ info })
  })
