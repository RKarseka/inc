import { Router } from 'express'
import { vAuth, vCUser } from '../validators/validators'
import { authValidationMiddleware, inputValidationMiddleware } from '../middlewares/input-validation-midleware'
import { container } from '../composition-root'
import { UsersController } from './users-controller'

// const usersController = ioc.getInstance<UsersController>(UsersController)
const usersController = container.resolve<UsersController>(UsersController)
export const usersRouter = Router({})

usersRouter.get('/', vAuth, authValidationMiddleware, usersController.getAllUsers.bind(usersController))

usersRouter.post('/', vCUser, vAuth, authValidationMiddleware, inputValidationMiddleware, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', vAuth, authValidationMiddleware, usersController.deleteUser.bind(usersController))
