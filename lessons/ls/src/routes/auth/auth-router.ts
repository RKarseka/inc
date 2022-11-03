import { Request, Response, Router } from "express";
import { userService } from "../../domain/user-service";
import { jwtService } from "../../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login',
  async (req: Request, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
      const token = await jwtService.createJWT(user)
      res.status(201).send(token)
    } else {
      res.sendStatus(401)
    }
  }
)