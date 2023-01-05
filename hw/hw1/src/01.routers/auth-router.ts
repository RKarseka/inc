import { Request, Response, Router } from 'express'
import { vACode, vAPasswordRecovery, vCEmail, vCUser } from '../validators/validators'
import { inputValidationMiddleware } from '../middlewares/input-validation-midleware'
import { authService } from '../02.domain/auth-service'
import { authMiddleware } from '../middlewares/auth-middleware'
import {IUserWithConfirmation, usersService} from '../02.domain/users-service'
import { emailManager } from '../-managers/email-manager'
import { emailAdapter } from '../-adapters/email-adapter'
import { makeError } from '../validators/helper'
import { loggerMW } from '../middlewares/logger-middleware'

export const authRouter = Router({})

authRouter.post('/login', loggerMW, async (req: Request, res: Response) => {
  const { loginOrEmail, password } = req.body

  const tokens = await authService.loginUser(loginOrEmail, password, req.ip)

  if (!tokens) {
    res.sendStatus(401)
    return
  }
  const { accessToken, refreshToken } = tokens
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
  res.send({ accessToken })
}
)

authRouter.post('/refresh-token', async (req: Request, res: Response) => {
  const exitFn = () => res.sendStatus(401)

  const prevRefreshToken = req.cookies.refreshToken
  if (!prevRefreshToken) {
    exitFn()
    return
  }

  const tokens = await authService.updateAccessToken(prevRefreshToken, req.ip)
  if (!tokens) {
    exitFn()
    return
  }

  const { accessToken, refreshToken } = tokens
  res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
  res.send({ accessToken })
})

authRouter.post('/registration', loggerMW, vCUser, inputValidationMiddleware, async (req: Request, res: Response) => {
  const usersEmail = await usersService.getUserByEmail(req.body.email)
  const usersLogin = await usersService.getUserByLogin(req.body.login)
  if (usersEmail || usersLogin) {
    const field = usersLogin ? 'login' : 'email'
    res.status(400).send(makeError(field))
    return
  }
  const newUser = await usersService.createUser(req.body)
  const getUser = await usersService.getUserById(newUser.id)
  const email = emailManager.makeRegistrationConfirmationEmail(req.body.email, getUser?.confirmationCode)
  await emailAdapter.sendEmail(email)
  res.sendStatus(204)
})

authRouter.post('/registration-confirmation', loggerMW, vACode, inputValidationMiddleware, async (req: Request, res: Response) => {
  const user = await usersService.getUserByCode<IUserWithConfirmation>(req.body.code)
  if ((user == null) || user.isConfirmed) {
    res.status(400).send(makeError('code'))
    return
  }

  const editing = await usersService.setEmailConfirmationForUserByCode(user)

  res.sendStatus(editing ? 204 : 400)
})

authRouter.post('/registration-email-resending', loggerMW, vCEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
  const user = await usersService.getUserByEmail<IUserWithConfirmation>(req.body.email)
  if ((user == null) || user.isConfirmed) {
    res.status(400).send(makeError('email'))
    return
  }
  const confirmationCode = new Date().toISOString()

  const updateUserResult = await usersService.updateUser(user.id, { ...user, confirmationCode })

  if (!updateUserResult) {
    res.sendStatus(400)
    return
  }

  const email = emailManager.makeRegistrationConfirmationEmail(user.email, confirmationCode)
  await emailAdapter.sendEmail(email)

  res.sendStatus(204)
})

authRouter.post('/logout', async (req: Request, res: Response) => {
  const exitFn = () => res.sendStatus(401)
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    exitFn()
    return
  }

  const logout = await authService.logoutUser(refreshToken)
  logout ? res.sendStatus(204) : exitFn()
})

authRouter.post('/password-recovery', loggerMW, vCEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
  await authService.sendRecoveryCode(req.body.email)

  res.sendStatus(204)
})

authRouter.post('/new-password', loggerMW, vAPasswordRecovery, inputValidationMiddleware, async (req: Request, res: Response) => {
  const result = await authService.setNewPassword(req.body.recoveryCode, req.body.newPassword)

  if (!result) {
    res.status(400).send(makeError('recoveryCode'))
    return
  }

  res.sendStatus(204)
})

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
  res.send(req.user)
})
