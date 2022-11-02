import { Request, Response, Router } from "express";
import { vAuth, vCUser } from "../validators/validators";
import { usersService } from "../domain/users-service";
import { makeGetAllParams } from "../helpers/helpers";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";

export const usersRouter = Router({})


usersRouter.get('/', vAuth, authValidationMiddleware, async (req: Request, res: Response) => {
    const searchFields = [ 'searchLoginTerm', 'searchEmailTerm' ]
    const params = makeGetAllParams(req.params, searchFields)
    res.send(await usersService.getAllUsers(params))
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