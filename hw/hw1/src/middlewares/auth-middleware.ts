import "reflect-metadata"
import {jwtService} from '../-application/jwt-service'
import {NextFunction, Request, Response} from 'express'
import {IUserMe, IUserShort, usersService} from '../02.domain/users-service'

export const checkAuthorization = async (req: Request): Promise<IUserShort> => {
  const emptyUser = {userId: 'userId', login: 'login', email: 'email'}
  const authorization = req.headers.authorization
  if (!authorization) {
    return emptyUser
  }

  const token = authorization.split(' ')[1]
  const user = await jwtService.getUserIdByAccessToken(token) as { userId: string, login: string, email: string }
  if (!user) {
    return emptyUser
  }
  const mapFn = ({id, login, email}: IUserMe): IUserShort => ({userId: id, login, email})
  const foundUser = await usersService.getUserById(user.userId, mapFn)
  console.log('const foundUser = ', foundUser)
  if (!foundUser) {
    return emptyUser

  }
  return foundUser
}


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const user: IUserShort = await checkAuthorization(req)
  if (user.userId === 'userId') {
    res.sendStatus(401)
    return
  }
  req.user = user
  next()
}


export const checkAuthorizationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  req.user = await checkAuthorization(req)
  next()
}