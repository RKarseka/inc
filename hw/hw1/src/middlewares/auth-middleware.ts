import {jwtService} from '../-application/jwt-service'
import {NextFunction, Request, Response} from 'express'
import {IUserMe, IUserShort, usersService} from '../02.domain/users-service'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization
  if (!authorization) {
    res.sendStatus(401)
    return
  }

  const token = authorization.split(' ')[1]
  const user = await jwtService.getUserIdByAccessToken(token)
  if (user) {
    const mapFn = ({id, login, email}: IUserMe): IUserShort => ({userId: id, login, email})
    // @ts-ignore
    // req.user = await usersService.getUserById(userId, mapFn)
    req.user = {id: user.userId, login: 'login'}
    next()
  } else {
    res.sendStatus(401)
  }
}
