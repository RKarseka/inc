import {Request, Response, Router} from "express";
import {vACode, vCEmail, vCUser, vLogin} from "../validators/validators";
import {inputValidationMiddleware} from "../middlewares/input-validation-midleware";
import {authService} from "../02.domain/auth-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {IUser, IUserWithConfirmation, usersService} from "../02.domain/users-service";
import {emailManager} from "../-managers/email-manager";
import {emailAdapter} from "../-adapters/email-adapter";
import {usersRepository} from "../03.repositories/users-repository";
import {makeError} from "../validators/helper";

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

authRouter.post('/registration', vCUser, inputValidationMiddleware, async (req: Request, res: Response) => {
  const usersEmail = await usersService.getUserByEmail( req.body.email)
  const usersLogin = await usersService.getUserByLogin(req.body.login)
  if (usersEmail || usersLogin) {
    const field = usersLogin ? 'login' : 'email'
    res.status(400).send(makeError(field))
    return
  }
  const newUser = await usersService.createUser(req.body)
  const getUser = await usersService.getUserById<IUserWithConfirmation>(newUser.id)
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
  console.log('const getUser = ', getUser)
  if (!getUser || getUser.isConfirmed) {
    const field = getUser ? 'email' : 'user'
    res.status(400).send(makeError(field))
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

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
  res.send(req.user)
})