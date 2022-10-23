import { Request, Response, Router } from "express"
import { vCEBlog } from "../validators/validators";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { blogsRepository } from "../repositories/blogs-repository";

export const blogsRouter = Router({})
blogsRouter.get('/', (req: Request, res: Response) => {
  res.send(blogsRepository.getAll())
})

blogsRouter.post('/', vCEBlog, authValidationMiddleware, inputValidationMiddleware,
  (req: Request, res: Response) => {
    res.status(201).send(blogsRepository.create(req.body))
  })

blogsRouter.get('/:id', (req: Request, res: Response) => {
  const product = blogsRepository.getOne(req.params.id)
  res.send(product || 404)
})

blogsRouter.put('/:id', vCEBlog, authValidationMiddleware, inputValidationMiddleware,
  (req: Request, res: Response) => {
    const newBlog = blogsRepository.editOne(req.params.id, req.body)
    res.send(newBlog ? 204 : 404)
  })
blogsRouter.delete('/:id', vCEBlog, authValidationMiddleware,
  (req: Request, res: Response) => {
    res.send(blogsRepository.deleteOne(req.params.id) ? 204 : 404)
  })