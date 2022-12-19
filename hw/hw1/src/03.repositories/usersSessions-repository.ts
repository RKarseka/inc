import {abstractRepository, mapFnDef} from "./abstract-repository";
import {usersSessionsCollection} from "./db";
import {IUserSessionData} from "../02.domain/security-service";


export const usersSessionsRepository = {
  async insertSession(session: IUserSessionData, ip: string) {
    return await abstractRepository.insertOne(session, usersSessionsCollection)
  },

  async getSessionsByUserId(userId: string,) {
    const items = await abstractRepository.getAllFromCollection({userId}, usersSessionsCollection)
    return items.map(({lastActiveDate, deviceId, ip, title}: IUserSessionData) =>
      ({ip, title, lastActiveDate, deviceId}))
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