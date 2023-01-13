import {Request, Response, Router} from 'express'
import {authValidationMiddleware, inputValidationMiddleware} from '../middlewares/input-validation-midleware'
import {vAuth, vBlogID, vCEComment, vCEPost} from '../validators/validators'
import {blogsRepository} from '../03.repositories/blogs-repository'
import {postsRepository} from '../03.repositories/posts-repository'
import {postsService} from '../02.domain/posts-service'
import {authMiddleware, checkAuthorizationMiddleware} from '../middlewares/auth-middleware'
import {commentsService} from '../02.domain/comments-service'

export const postsRouter = Router({})

postsRouter.get('/', checkAuthorizationMiddleware, async (req: Request, res: Response) => {
  const posts = await postsService.getAllPosts(req.query, req.user.userId)
  res.send(posts)
})

postsRouter.post('/', vBlogID, vCEPost, authValidationMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const blog = await blogsRepository.getOne(req.body.blogId)
    if (blog == null) {
      return res.send(404)
    }

    const post = await postsService.createPost({...req.body, blogId: blog.name, blogName: blog.name})
    if (post) {
      res.status(201).send(post)
    } else {
      res.sendStatus(400)
    }
  }
)

postsRouter.get('/:id', checkAuthorizationMiddleware, async (req: Request, res: Response) => {
  const product = await postsService.getOnePost(req.params.id, req.user.userId)
  res.send(product || 404)
})

postsRouter.put('/:id', vBlogID, vCEPost, vAuth, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await postsRepository.editOne(req.params.id, req.body)
    res.send(newBlog ? 204 : 404)
  })

postsRouter.put('/:id/like-status', authMiddleware, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.sendStatus(await postsService.setPostLike(req.params.id, req.body, req.user))
  })
postsRouter.delete('/:id', vCEPost, authValidationMiddleware,
  async (req: Request, res: Response) => {
    res.send(await postsRepository.deleteOne(req.params.id) ? 204 : 404)
  })
postsRouter.get('/:id/comments', checkAuthorizationMiddleware, async (req: Request, res: Response) => {
  const comments = await commentsService.getComments(req.query, req.params.id, req.user.userId)
  if (comments != null) {
    res.send(comments)
  } else {
    res.sendStatus(404)
  }
})
postsRouter.post('/:id/comments', vCEComment, authMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
  const comment = await commentsService.createComment(req.params.id, req.body.content, req.user)

  if (typeof comment === 'object') {
    res.status(201).send({...comment})
  } else {
    res.sendStatus(comment)
  }
})
