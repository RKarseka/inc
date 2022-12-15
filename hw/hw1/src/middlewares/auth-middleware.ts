import {jwtService} from "../-application/jwt-service";
import {NextFunction, Request, Response} from "express";
import {IUserMe, usersService} from "../02.domain/users-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    res.sendStatus(401)
    return
  }

  const token = authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByAccessToken(token)
  if (userId) {
    const mapFn = ({id, login, email}: IUserMe): IUserMe => ({id, login, email})
    req.user = await usersService.getUserById(userId)
    next()
  } else {
    res.sendStatus(401)
  }
}