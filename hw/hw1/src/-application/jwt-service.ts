import jwt, {JwtPayload} from "jsonwebtoken";
import {settings} from "../settings";

export const jwtService = {
  createJWT(userId: string, expiresIn = '150d', secret = settings.JWT_SECRET) {
    return jwt.sign({userId}, secret, {expiresIn})
  },

  generateAccessToken(userId: string) {
    const secret = settings.JWT_SECRET_AT
    const expiresIn = '10s'

    return this.createJWT(userId, expiresIn, secret)
  },

  generateRefreshToken(userId: string) {
    const secret = settings.JWT_SECRET_RT
    const expiresIn = '20s'

    return this.createJWT(userId, expiresIn, secret)
  },

  async getUserIdByRefreshToken(token: string) {
    const secret = settings.JWT_SECRET_RT
    return await this.getUserIdByToken(token, secret)
  },

  async getUserIdByAccessToken(token: string) {
    const secret = settings.JWT_SECRET_AT
    return await this.getUserIdByToken(token, secret)
  },

  async getUserIdByToken(token: string, secret = settings.JWT_SECRET) {
    try {
      const result: JwtPayload | string = jwt.verify(token, secret)
      // @ts-ignore
      return result.userId
    } catch (error) {
      return null
    }
  }
}