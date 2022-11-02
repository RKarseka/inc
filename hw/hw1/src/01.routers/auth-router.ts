import { Request, Response, Router } from "express";
import { vLogin } from "../validators/validators";
import { inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { authService } from "../02.domain/auth-service";

export const authRouter = Router({})

authRouter.post('/login', vLogin, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body
    const auth = await authService.checkAuth(loginOrEmail, password)
    res.sendStatus(auth ? 204 : 401)
  }
)