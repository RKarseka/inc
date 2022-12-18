import {jwtService} from "../-application/jwt-service";

export interface IUserSessionData {
  deviceId: string,
  refreshToken: string,
  expirationDate: Date,
  userId: string
}

export const securityService = {
  async getActiveDevices(refreshToken: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken)
    if (!refreshTokenData) return null
    // @ts-ignore
    const {userId, deviceId} = refreshTokenData
    return ''
  }
}