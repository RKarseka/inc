import { Request, Response, Router } from "express";
import { commentsService } from "../02.domain/comments-service";
import { vAuth, vEComment } from "../validators/validators";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";


export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    res.send(await commentsService.getOneComment(req.params.id))
  }
)
commentsRouter.put('/:id', vEComment, vAuth, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.sendStatus(await commentsService.editOwnComment(req.params.id, req.body))
  })
commentsRouter.delete('/:id', vAuth, authValidationMiddleware, async (req: Request, res: Response) => {
  res.sendStatus(await commentsService.delOwnComment(req.params.id))
})