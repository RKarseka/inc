import { Request, Response, Router } from "express";
import { vAuth, vCUser } from "../validators/validators";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { usersService } from "../02.domain/users-service";

export const usersRouter = Router({})


usersRouter.get('/', vAuth, authValidationMiddleware, async (req: Request, res: Response) => {
    const users = await usersService.getAllUsers(req.query)
    res.send(users)
  }
)

usersRouter.post('/', vCUser, vAuth, authValidationMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {
    res.status(201).send(await usersService.createUser(req.body))
  }
)

usersRouter.delete('/:id', vAuth, authValidationMiddleware, async (req: Request, res: Response) => {
    res.send(await usersService.deleteUser(req.params.id) ? 204 : 404)
  }
)