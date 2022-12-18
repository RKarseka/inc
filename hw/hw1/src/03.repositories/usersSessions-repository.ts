import {abstractRepository, mapFnDef} from "./abstract-repository";
import {usersSessionsCollection} from "./db";
import {IUserSessionData} from "../02.domain/security-service";


export const usersSessionsRepository = {
  async insertSession(refreshTokenData: IUserSessionData) {
    return await abstractRepository.insertOne(refreshTokenData, usersSessionsCollection)
  },

  async getSessionsByUserId(userId: string) {
    const items = await abstractRepository.getAllFromCollection({userId}, usersSessionsCollection)
    return items.map(({lastActiveDate, deviceId}: IUserSessionData) =>
      ({ip: '1.1.1.1', title: 'string', lastActiveDate, deviceId}))
  },

  async deleteSessionById(deviceId: string) {
    return await abstractRepository.deleteOne(deviceId, usersSessionsCollection, 'deviceId')
  },

  async deleteAllSessionsExcludeCurrent(deviceId: string, userId: string) {
    return await abstractRepository.deleteMany<IUserSessionData>({
      userId,
      deviceId: {$nin: [deviceId]}
    }, usersSessionsCollection)
  },

  async findSession(deviceId: string) {
    return await abstractRepository.getOne<IUserSessionData>(deviceId, usersSessionsCollection, mapFnDef<IUserSessionData, IUserSessionData>, 'deviceId')
  }
}