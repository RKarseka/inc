import { Request, Response, Router } from "express";
import { authService } from "../domain/auth-service";
import { vLogin } from "../validators/validators";
import { inputValidationMiddleware } from "../middlewares/input-validation-midleware";

export const authRouter = Router({})

authRouter.post('/login', vLogin, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body
    const auth = await authService.checkAuth(loginOrEmail, password)
    res.sendStatus(auth ? 204 : 401)
  }
)