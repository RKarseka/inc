import jwt, {JwtPayload} from "jsonwebtoken";
import {settings} from "../settings";
import {ObjectId} from "mongodb";
import {add} from "date-fns";

interface tokenPayload {
  [name: string]: string
}

export interface IRefreshToken {
  userId: string,
  deviceId: string,
  iat: number,
  exp: number

}

export const jwtService = {
  createJWT(payload: tokenPayload, expiresIn = '150d', secret = settings.JWT_SECRET) {
    return jwt.sign(payload, secret, {expiresIn})
  },

  generateAccessToken(userId: string, deviceId: string) {
    const secret = settings.JWT_SECRET_AT
    const expiresIn = '10d'
    // const token = JSON.stringify({userId, deviceId})

    return this.createJWT({userId, deviceId}, expiresIn, secret)
  },

  generateRefreshToken(userId: string) {
    const secret = settings.JWT_SECRET_RT
    const expiresIn = '20d'
    const deviceId = new ObjectId() + ''
    const refreshToken = this.createJWT({userId, deviceId}, expiresIn, secret)
    const expirationDate = add(new Date(), {days: 20}) //seconds
    return {deviceId, refreshToken, expirationDate, userId}
  },

  async getDataByRefreshToken(token: string) {
    const secret = settings.JWT_SECRET_RT
    return await this.getUserIdByToken(token, secret)
  },

  async getDataByAccessTokenData(token: string) {
    const secret = settings.JWT_SECRET_AT
    return await this.getUserIdByToken(token, secret)
  },

  async getUserIdByAccessToken(token: string) {
    const secret = settings.JWT_SECRET_AT
    return await this.getUserIdByToken(token, secret)
  },

  async getUserIdByToken(token: string, secret = settings.JWT_SECRET) {
    try {
      return jwt.verify(token, secret)
      // // @ts-ignore
      // return result.userId
    } catch (error) {
      return null
    }
  }
}