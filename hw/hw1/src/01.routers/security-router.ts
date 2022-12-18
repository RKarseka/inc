import {Request, Response, Router} from "express";
import {securityService} from "../02.domain/security-service";

export const securityRouter = Router({})

securityRouter.get('/devices', async (req: Request, res: Response) => {
  const exitFn = () => res.sendStatus(401)
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    exitFn()
    return
  }

  const data = await securityService.getActiveDevices(refreshToken)

  if (!data) {
    exitFn()
    return
  }

})