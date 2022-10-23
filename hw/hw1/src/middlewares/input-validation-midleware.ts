import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"
const errorFormatter = ({msg, param}: any) => ({message: msg, field: param})

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(errorFormatter)
  if (!errors.isEmpty()) {
    return res.status(400).json({errorsMessages: errors.array()})
  } else {
    next()
  }
}

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).formatWith(errorFormatter)
  if (!!errors.mapped()?.Authorization || !!errors.mapped()?.authorization) {
    return res.send(401)
  }
  next()
}