import {Request, Response, Router} from "express";
import {vAuth, vCUser} from "../validators/validators";
import {authValidationMiddleware, inputValidationMiddleware} from "../middlewares/input-validation-midleware";
import {usersService} from "../02.domain/users-service";
import {loggerMW} from "../middlewares/logger-middleware";

export const usersRouter = Router({})


usersRouter.get('/', loggerMW, vAuth, authValidationMiddleware, async (req: Request, res: Response) => {
    const users = await usersService.getAllUsers(req.query)
    res.send(users)
  }
)

usersRouter.post('/', loggerMW, vCUser, vAuth, authValidationMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
    res.status(201).send(await usersService.createUser(req.body, true))
  }
)

usersRouter.delete('/:id', loggerMW, vAuth, authValidationMiddleware, async (req: Request, res: Response) => {
    res.send(await usersService.deleteUser(req.params.id) ? 204 : 404)
  }
)