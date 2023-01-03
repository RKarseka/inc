import {Request, Response, Router} from 'express'
import {vAuth, vCUser} from '../validators/validators'
import {authValidationMiddleware, inputValidationMiddleware} from '../middlewares/input-validation-midleware'
import {UserService} from '../02.domain/users-service'

export const usersRouter = Router({})

class UsersController {
  private usersService: UserService;

  constructor() {
    this.usersService = new UserService()

  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.usersService.getAllUsers(req.query)
    res.send(users)
  }

  async getUser() {
  }

  async createUser(req: Request, res: Response) {
    res.status(201).send(await this.usersService.createUser(req.body, true))
  }

  async deleteUser(req: Request, res: Response) {
    res.send(await this.usersService.deleteUser(req.params.id) ? 204 : 404)
  }
}

const usersControllerInstance = new UsersController()

usersRouter.get('/', vAuth, authValidationMiddleware, usersControllerInstance.getAllUsers.bind(usersControllerInstance))

usersRouter.post('/', vCUser, vAuth, authValidationMiddleware, inputValidationMiddleware, usersControllerInstance.createUser.bind(usersControllerInstance))

usersRouter.delete('/:id', vAuth, authValidationMiddleware, usersControllerInstance.deleteUser.bind(usersControllerInstance))
