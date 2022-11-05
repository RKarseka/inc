import {Request, Response, Router} from "express";
import {vLogin} from "../validators/validators";
import {inputValidationMiddleware} from "../middlewares/input-validation-midleware";
import {authService} from "../02.domain/auth-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";

export const authRouter = Router({})

authRouter.post('/login', vLogin, inputValidationMiddleware, async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body
    const user = await authService.checkCredentials(loginOrEmail, password)
    if (!user) {
      res.sendStatus(401)
    } else {
      const accessToken = jwtService.createJWT(user.id)
      res.send({accessToken})
    }
  }
)

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
  res.send(req.user)
})