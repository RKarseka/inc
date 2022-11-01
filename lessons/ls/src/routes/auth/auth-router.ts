import { Request, Response, Router } from "express";
import { userService } from "../../domain/user-service";

export const authRouter = Router({})

authRouter.post('login',
  async (req: Request, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkResult.resultCode === 0) {
      res.status(201).send(checkResult.data)
    } else {
      res.sendStatus(401)
    }
  }
)