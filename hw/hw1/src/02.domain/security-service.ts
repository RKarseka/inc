import { IRefreshToken, jwtService } from '../-application/jwt-service'
import { usersSessionsRepository } from '../03.repositories/usersSessions-repository'

export interface IUserSessionUpdateData {
  refreshToken: string
  expirationDate: Date
  lastActiveDate: Date
  ip: string

}

export interface IUserSessionData extends IUserSessionUpdateData {
  id: string
  deviceId: string
  userId: string
  title: string
}

export const securityService = {
  async getActiveDevices (refreshToken: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null

    if (refreshTokenData == null) return null
    const { userId, deviceId } = refreshTokenData

    return await usersSessionsRepository.getSessionsByUserId(userId)
  },

  async deleteAllSessionsExcludeCurrent (refreshToken: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null
    if (refreshTokenData == null) return null

    return await usersSessionsRepository.deleteAllSessionsExcludeCurrent(refreshTokenData.deviceId, refreshTokenData.userId)
  },

  async deleteOneSession (refreshToken: string, deviceId: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null
    if (refreshTokenData == null) return 401

    const session = await usersSessionsRepository.findSession(deviceId)

    if (session == null) return 404

    if (session.userId !== refreshTokenData.userId) return 403

    return await usersSessionsRepository.deleteSession(session.deviceId)
  }
}
