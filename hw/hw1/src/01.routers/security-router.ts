import {Request, Response, Router} from "express";
import {securityService} from "../02.domain/security-service";

export const securityRouter = Router({})

securityRouter.get('/devices', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    res.sendStatus(401)
    return
  }

  const data = await securityService.getActiveDevices(refreshToken)

  if (!data) {
    res.sendStatus(400)
    return
  }

  res.send(data)
})

securityRouter.delete('/devices', async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    res.sendStatus(401)
    return
  }
  const resa = await securityService.deleteAllSessionsExcludeCurrent(refreshToken)
  if (!resa) {
    res.sendStatus(401)
    return
  }

  res.sendStatus(204)

})

securityRouter.delete('/devices/:deviceId', async (req: Request, res: Response) => {

  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    res.sendStatus(401)
    return
  }

  const result = await securityService.deleteOneSession(refreshToken, req.params.deviceId)

  result ? res.status(204).send(result) : res.sendStatus(result || 400)


})