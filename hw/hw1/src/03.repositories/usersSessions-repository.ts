import {abstractRepository} from "./abstract-repository";
import {usersSessionsCollection} from "./db";
import {IUserSessionData} from "../02.domain/security-service";


export const usersSessionsRepository = {
  async insertSession(refreshTokenData: IUserSessionData) {
    return await abstractRepository.insertOne(refreshTokenData, usersSessionsCollection)
  },

  async getSessionsByUserId(userId: string) {

  }
}