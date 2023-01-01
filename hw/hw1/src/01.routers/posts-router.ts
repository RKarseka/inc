import { Request, Response, Router } from 'express'
import { authValidationMiddleware, inputValidationMiddleware } from '../middlewares/input-validation-midleware'
import { vBlogID, vCEComment, vCEPost } from '../validators/validators'
import { blogsRepository } from '../03.repositories/blogs-repository'
import { postsRepository } from '../03.repositories/posts-repository'
import { postsService } from '../02.domain/posts-service'
import { authMiddleware } from '../middlewares/auth-middleware'
import { commentsService } from '../02.domain/comments-service'

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
  const posts = await postsService.getAllPosts(req.query)
  res.send(posts)
})

postsRouter.post('/', vBlogID, vCEPost, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blog = await blogsRepository.getOne(req.body.blogId)
    if (blog == null) {
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
  res.send((product != null) || 404)
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
postsRouter.get('/:id/comments', async (req: Request, res: Response) => {
  const comments = await commentsService.getComments(req.query, req.params.id)
  if (comments != null) {
    res.send(comments)
  } else {
    res.sendStatus(404)
  }
})
postsRouter.post('/:id/comments', vCEComment, authMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
  const comment = await commentsService.createComment(req.params.id, req.body.content, req.user)

  if (typeof comment === 'object') {
    res.status(201).send({ ...comment })
  } else {
    res.sendStatus(comment)
  }
})
