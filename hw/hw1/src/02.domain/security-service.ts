import {IRefreshToken, jwtService} from "../-application/jwt-service";
import {usersSessionsRepository} from "../03.repositories/usersSessions-repository";

export interface IUserSessionData {
  id: string,
  deviceId: string,
  refreshToken: string,
  expirationDate: Date,
  lastActiveDate: Date,
  userId: string
}

export const securityService = {
  async getActiveDevices(refreshToken: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null

    if (!refreshTokenData) return null
    const {userId, deviceId} = refreshTokenData

    return await usersSessionsRepository.getSessionsByUserId(userId)
  },

  async deleteAllSessionsExcludeCurrent(refreshToken: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null
    if (!refreshTokenData) return null

    return await usersSessionsRepository.deleteAllSessionsExcludeCurrent(refreshTokenData.deviceId, refreshTokenData.userId)
  },

  async deleteOneSession(refreshToken: string, deviceId: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null
    if (!refreshTokenData) return 401

    const session = await usersSessionsRepository.findSession(deviceId)

    if (!session) return 404

    if (session.userId !== refreshTokenData.userId) return 403

    return await usersSessionsRepository.deleteSessionById(session.deviceId)
  }
}