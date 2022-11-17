import {Request, Response, Router} from "express";
import {commentsService} from "../02.domain/comments-service";
import {vAuth, vEComment} from "../validators/validators";
import {authValidationMiddleware, inputValidationMiddleware} from "../middlewares/input-validation-midleware";
import {authMiddleware} from "../middlewares/auth-middleware";


export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const comment = await commentsService.getOneComment(req.params.id)
    if (comment) {
      res.send(comment)
    } else {
      res.sendStatus(404)
    }
  }
)
commentsRouter.put('/:id', vEComment, authMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.sendStatus(await commentsService.editOwnComment(req.params.id, req.body, req.user))
  })
commentsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  res.sendStatus(await commentsService.delOwnComment(req.params.id))
})