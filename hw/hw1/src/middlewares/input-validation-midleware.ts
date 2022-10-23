import { NextFunction, Request, Response } from "express"
import { validationResult } from "express-validator"

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({errorsMessages: errors.array().map(({msg, param}) => ({message: msg, field: param}))})
  } else {
    next()
  }
}

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!!errors.mapped()?.Authorization || !!errors.mapped()?.authorization) {
    return res.send(401)
  }
  next()
}