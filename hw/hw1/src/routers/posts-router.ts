import { Request, Response, Router } from "express"
import { postsRepository } from "../repositories/posts-repository";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { vBlogID, vCEPost } from "../validators/validators";
import { blogsRepository } from "../repositories/blogs-repository";
import { SortDirection } from "mongodb";
import { makeGetAllParams } from "../helpers/helpers";

export const postsRouter = Router({})

export const createPost = async (req: Request, res: Response) => {
  const blog = await blogsRepository.getOne(req.params.blogId || req.body.blogId)
  if (!blog) {
    return res.send(404)
  }
  res.status(201).send(await postsRepository.create({
    ...req.body,
    blogId: req.params.blogId || req.body.blogId,
    blogName: blog.name
  }))
}
postsRouter.get('/', async (req: Request, res: Response) => {
  const searchFields = [ 'id' ]
  const query = makeGetAllParams(req.query, searchFields)
  res.send(await postsRepository.getAll(query))
})

postsRouter.post('/', vBlogID, vCEPost, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blog = await blogsRepository.getOne(req.body.blogId)
    if (!blog) {
      return res.send(404)
    }
    res.status(201).send(await postsRepository.create({
      ...req.body,
      blogName: blog.name
    }))
  }
)

postsRouter.get('/:id', async (req: Request, res: Response) => {
  const product = await postsRepository.getOne(req.params.id)
  res.send(product || 404)
})

postsRouter.put('/:id', vBlogID, vCEPost, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await postsRepository.editOne(req.params.id, req.body)
    res.send(newBlog ? 204 : 404)
  })
postsRouter.delete('/:id', vCEPost, authValidationMiddleware,
  async (req: Request, res: Response) => {
    res.send(await postsRepository.deleteOne(req.params.id) ? 204 : 404)
  })