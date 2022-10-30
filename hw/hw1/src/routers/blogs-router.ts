import { Request, Response, Router } from "express"
import { vCEBlog, vCEPost } from "../validators/validators";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { blogsRepository } from "../repositories/blogs-repository";
import { postsRepository } from "../repositories/posts-repository";

export const blogsRouter = Router({})
blogsRouter.get('/', async (req: Request, res: Response) => {

  const query = {
    searchNameTerm: req.query.searchNameTerm?.toString().toLowerCase() || null,
    sortBy: req.query.sortBy?.toString() || 'createdAt',
    sortDirection: req.query.sortDirection?.toString() || 'desc',
    pageNumber: +(req.query.pageNumber || 1),
    pageSize: +(req.query.pageSize || 10),
  }
  res.send(await blogsRepository.getAll(query))
})

blogsRouter.post('/', vCEBlog, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.status(201).send(await blogsRepository.create(req.body))
  })
blogsRouter.get('/:id', async (req: Request, res: Response) => {
  const product = await blogsRepository.getOne(req.params.id)
  res.send(product || 404)
})
blogsRouter.put('/:id', vCEBlog, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await blogsRepository.editOne(req.params.id, req.body)
    res.send(newBlog ? 204 : 404)
  })
blogsRouter.delete('/:id', vCEBlog, authValidationMiddleware,
  async (req: Request, res: Response) => {
    res.send(await blogsRepository.deleteOne(req.params.id) ? 204 : 404)
  })
blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
  const query = {
    sortBy: req.query.sortBy?.toString() || 'createdAt',
    sortDirection: req.query.sortDirection?.toString() || 'desc',
    pageNumber: +(req.query.pageNumber || 1),
    pageSize: +(req.query.pageSize || 10),
  }
  res.send(await postsRepository.getAll(query))
})
blogsRouter.post('/:id/posts', vCEPost, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.status(201).send(await postsRepository.create({...req.body, "blogName": "string"}))
  })