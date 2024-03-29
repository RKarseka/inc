import { abstractRepository, mapFnDef } from './abstract-repository'
import { usersSessionsCollection } from './db'
import { IUserSessionData, IUserSessionUpdateData } from '../02.domain/security-service'

export const usersSessionsRepository = {
  async insertSession (session: IUserSessionData) {
    return await abstractRepository.insertOne(session, usersSessionsCollection)
  },

  async getSessionsByUserId (userId: string) {
    const items = await abstractRepository.getAllFromCollection({ userId }, usersSessionsCollection)
    return items.map(({ lastActiveDate, deviceId, ip, title }: IUserSessionData) =>
      ({ ip, title, lastActiveDate, deviceId }))
  },

  async deleteSession (value: string, field = 'deviceId') {
    return await abstractRepository.deleteOne(value, usersSessionsCollection, field)
  },

  async deleteAllSessionsExcludeCurrent (deviceId: string, userId: string) {
    return await abstractRepository.deleteMany<any>({
      userId,
      deviceId: { $nin: [deviceId] }
    }, usersSessionsCollection)
  },

  async findSession (value: string, field = 'deviceId') {
    return await abstractRepository.getOne<IUserSessionData>(value, usersSessionsCollection, mapFnDef<IUserSessionData, IUserSessionData>, field)
  },

  async updateSession (filterValue: string, value: IUserSessionUpdateData, filterField = 'refreshToken') {
    return await abstractRepository.updateOne(filterValue, value, usersSessionsCollection, filterField)
  }
}
