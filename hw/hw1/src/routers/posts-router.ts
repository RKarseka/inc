import { Request, Response, Router } from "express"
import { postsRepository } from "../repositories/posts-repository";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { vCEPost } from "../validators/validators";

export const postsRouter = Router({})
postsRouter.get('/', (req: Request, res: Response) => {
  res.send(postsRepository.getAll())
})

postsRouter.post('/', vCEPost, authValidationMiddleware, inputValidationMiddleware,
  (req: Request, res: Response) => {
    res.status(201).send(postsRepository.create({...req.body, "blogName": "string"}))
  })

postsRouter.get('/:id', (req: Request, res: Response) => {
  const product = postsRepository.getOne(req.params.id)
  res.send(product || 404)
})

postsRouter.put('/:id', vCEPost, authValidationMiddleware, inputValidationMiddleware,
  (req: Request, res: Response) => {
    const newBlog = postsRepository.editOne(req.params.id, req.body)
    res.send(newBlog ? 204 : 404)
  })
postsRouter.delete('/:id', vCEPost, authValidationMiddleware,
  (req: Request, res: Response) => {
    res.send(postsRepository.deleteOne(req.params.id) ? 204 : 404)
  })