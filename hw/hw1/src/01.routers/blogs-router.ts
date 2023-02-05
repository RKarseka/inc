import {Request, Response, Router} from 'express'
import {vCEBlog, vCEPost} from '../validators/validators'
import {authValidationMiddleware, inputValidationMiddleware} from '../middlewares/input-validation-midleware'
import {blogsService} from '../02.domain/blogs-service'
import {blogsRepository} from '../03.repositories/blogs-repository'
import {postsRepository} from '../03.repositories/posts-repository'
import {postsService} from "../02.domain/posts-service";
import {checkAuthorizationMiddleware} from "../middlewares/auth-middleware";

export const blogsRouter = Router({})
blogsRouter.get('/', async (req: Request, res: Response) => {
  const query = {
    searchNameTerm: req.query.searchNameTerm?.toString().toLowerCase() || null,
    sortBy: req.query.sortBy?.toString() || 'createdAt',
    sortDirection: req.query.sortDirection?.toString() || 'desc',
    pageNumber: +(req.query.pageNumber || 1),
    pageSize: +(req.query.pageSize || 10)
  }
  res.send(await blogsRepository.getAll(query))
})

blogsRouter.post('/', vCEBlog, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.status(201).send(await blogsRepository.create(req.body))
  })
blogsRouter.get('/:id', async (req: Request, res: Response) => {
  const product = await blogsRepository.getOne(req.params.id)
  res.send((product != null) || 404)
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
blogsRouter.get('/:blogId/posts', checkAuthorizationMiddleware,
  async (req: Request, res: Response) => {
    const posts = await blogsService.getPostsByBlog(req.query, req.params.blogId, req.user.userId)
    res.send(posts || 404)
  })
blogsRouter.post('/:blogId/posts', vCEPost, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blog = await blogsRepository.getOne(req.params.blogId)
    if (blog == null) {
      return res.send(404)
    }

    const post = await postsService.createPost({...req.body, blogId: blog.name, blogName: blog.name})

    if (post) {
      res.status(201).send(post)
    } else {
      res.sendStatus(400)
    }
  })
