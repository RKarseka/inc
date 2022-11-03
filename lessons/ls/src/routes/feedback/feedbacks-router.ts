import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth-middleware";

export const feedbacksRouter = Router({})

feedbacksRouter
  .post('/', authMiddleware,
    async (req, res) => {
      const newProduct = await feedbackService.sendFeddback(req.body.comment, req.user!._id)
      res.status(201).send(newProduct)
    })
  .get('/',
    async (req, res) => {
      const users = await feedbackService.allFeedbacks()
      res.send(users)
    })