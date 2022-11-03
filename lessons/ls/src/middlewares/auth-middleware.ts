import { jwtService } from "../application/jwt-service";
import { userService } from "../domain/user-service";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    res.send(401)
    return
  }

  const token = req.headers.authorization.split(' ')[1]
  const userId = await jwtService.getUserIdByToken(token)
  if (userId) {
    req.user = await userService.findUserById(userId)
    next()
  }
  res.send(401)
}