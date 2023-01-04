import {Router} from 'express'
import {vAuth, vCUser} from '../validators/validators'
import {authValidationMiddleware, inputValidationMiddleware} from '../middlewares/input-validation-midleware'
import {usersController} from "../composition-root";

export const usersRouter = Router({})


usersRouter.get('/', vAuth, authValidationMiddleware, usersController.getAllUsers.bind(usersController))

usersRouter.post('/', vCUser, vAuth, authValidationMiddleware, inputValidationMiddleware, usersController.createUser.bind(usersController))

usersRouter.delete('/:id', vAuth, authValidationMiddleware, usersController.deleteUser.bind(usersController))
