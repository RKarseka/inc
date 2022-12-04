import {NextFunction, Request, Response} from "express"
import {validationResult} from "express-validator"

export const errorFormatter = ({msg, param}: any) => ({message: msg, field: param})
export const customValidationResult = (req: Request) => validationResult(req).formatWith(errorFormatter)

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('const validationResult(req) = ', validationResult(req))
  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    return res.status(400).json({errorsMessages: errors.array()})
  } else {
    next()
  }
}

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = customValidationResult(req)
  if (!!errors.mapped()?.Authorization || !!errors.mapped()?.authorization) {
    return res.sendStatus(401)
  }
  next()
}