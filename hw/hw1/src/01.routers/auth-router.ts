import {Request, Response, Router} from "express";
import {vACode, vCEmail, vCUser, vLogin} from "../validators/validators";
import {inputValidationMiddleware} from "../middlewares/input-validation-midleware";
import {authService} from "../02.domain/auth-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {IUserWithConfirmation, usersService} from "../02.domain/users-service";
import {emailManager} from "../-managers/email-manager";
import {emailAdapter} from "../-adapters/email-adapter";
import {makeError} from "../validators/helper";
import {loggerMW} from "../middlewares/logger-middleware";

export const authRouter = Router({})

authRouter.post('/login', async (req: Request, res: Response) => {
    const {loginOrEmail, password} = req.body

    const tokens = await authService.loginUser(loginOrEmail, password, req.ip)

    if (!tokens) {
      res.sendStatus(401)
      return
    }
    const {accessToken, refreshToken} = tokens
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
    res.send({accessToken})

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

  const {accessToken, refreshToken} = tokens
  res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
  res.send({accessToken})
})

authRouter.post('/registration', vCUser, inputValidationMiddleware, async (req: Request, res: Response) => {
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

authRouter.post('/registration-confirmation', vACode, inputValidationMiddleware, async (req: Request, res: Response) => {
  const user = await usersService.getUserByCode<IUserWithConfirmation>(req.body.code)
  if (!user || user.isConfirmed) {
    res.status(400).send(makeError('code'))
    return
  }

  const editing = await usersService.setEmailConfirmationForUserByCode(user)

  res.sendStatus(editing ? 204 : 400)
})

authRouter.post('/registration-email-resending', vCEmail, inputValidationMiddleware, async (req: Request, res: Response) => {
  const getUser = await usersService.getUserByEmail<IUserWithConfirmation>(req.body.email)
  if (!getUser || getUser.isConfirmed) {
    res.status(400).send(makeError('email'))
    return
  }

  const confirmationCode = await usersService.updateConfirmationCode(getUser)

  if (!confirmationCode) {
    res.sendStatus(400)
    return
  }

  const email = emailManager.makeRegistrationConfirmationEmail(getUser.email, confirmationCode)
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

authRouter.get('/me', loggerMW, authMiddleware, async (req: Request, res: Response) => {
  res.send(req.user)
})

