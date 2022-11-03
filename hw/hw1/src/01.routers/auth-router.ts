import { Request, Response, Router } from "express";
import { vAuth, vLogin } from "../validators/validators";
import { authValidationMiddleware, inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { authService } from "../02.domain/auth-service";
import { usersService } from "../02.domain/users-service";

export const authRouter = Router({})

authRouter.post('/login', vLogin, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body

    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)


    const auth = await authService.checkAuth(loginOrEmail, password)
    res.sendStatus(auth ? 204 : 401)
  }
)

authRouter.get('me',vAuth, authValidationMiddleware,  async (req: Request, res: Response) => {
  res.send(await authService.getMe())
})