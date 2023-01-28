import {Request, Response, Router} from 'express'
import {commentsService} from '../02.domain/comments-service'
import {vEComment, vLikeComment} from '../validators/validators'
import {authValidationMiddleware, inputValidationMiddleware} from '../middlewares/input-validation-midleware'
import {authMiddleware, checkAuthorizationMiddleware} from '../middlewares/auth-middleware'
import {jwtService} from "../-application/jwt-service";

export const commentsRouter = Router({})

commentsRouter.get('/:id', checkAuthorizationMiddleware, async (req: Request, res: Response) => {
    console.log('const req.user = ', req.user)
    const comment = await commentsService.getOneComment(req.params.id, req.user.userId)
    if (comment != null) {
      res.send(comment)
    } else {
      res.sendStatus(404)
    }
  }
)

commentsRouter.put('/:id', commentsService.checkCommentPresent, vEComment, authMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.sendStatus(await commentsService.editOwnComment(req.params.id, req.body, req.user))
  })

commentsRouter.delete('/:id', commentsService.checkCommentPresent, authMiddleware, async (req: Request, res: Response) => {
  res.sendStatus(await commentsService.delOwnComment(req.params.id, req.user))
})


commentsRouter.put('/:id/like-status', commentsService.checkCommentPresent, vLikeComment, authMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.sendStatus(await commentsService.setCommentLike(req.params.id, req.body, req.user.userId))
  })
