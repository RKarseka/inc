import { Request, Response, Router } from 'express'
import { vAuth, vCUser } from '../validators/validators'
import { authValidationMiddleware, inputValidationMiddleware } from '../middlewares/input-validation-midleware'
import { usersService } from '../02.domain/users-service'

export const usersRouter = Router({})

class UsersController {
  async getAllUsers (req: Request, res: Response) {
    const users = await usersService.getAllUsers(req.query)
    res.send(users)
  }

  async getUser () {}

  async createUser (req: Request, res: Response) {
    res.status(201).send(await usersService.createUser(req.body, true))
  }

  async deleteUser (req: Request, res: Response) {
    res.send(await usersService.deleteUser(req.params.id) ? 204 : 404)
  }
}

const usersControllerInstance = new UsersController()

usersRouter.get('/', vAuth, authValidationMiddleware, usersControllerInstance.getAllUsers)

usersRouter.post('/', vCUser, vAuth, authValidationMiddleware, inputValidationMiddleware, usersControllerInstance.createUser)

usersRouter.delete('/:id', vAuth, authValidationMiddleware, usersControllerInstance.deleteUser)
