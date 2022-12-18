import {usersRepository} from "../03.repositories/users-repository";
import {bcryptService} from "../-application/bcrypt-service";
import {jwtService} from "../-application/jwt-service";
import {usersCollection} from "../03.repositories/db";
import {usersService} from "./users-service";
import {usersSessionsRepository} from "../03.repositories/usersSessions-repository";

export interface IMe {
  email: string,
  login: string,
  userId: string
}

export const authService = {

  async checkAuth(loginOrEmail: string, password: string) {
    return await usersRepository.loginOne(loginOrEmail, loginOrEmail, password)
  },

  async loginUser(loginOrEmail: string, password: string) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false

    const compare = await bcryptService.compare(password, user.passwordHash)
    if (!compare) return false

    const refreshTokenData = jwtService.generateRefreshToken(user.id) //20s
    const {refreshToken, deviceId} = refreshTokenData

    const accessToken = jwtService.generateAccessToken(user.id, deviceId) //10s

    const insertedSession = await usersSessionsRepository.insertSession(refreshTokenData)
    const userByAccessTokenData = await jwtService.getDataByAccessTokenData(accessToken)
    console.log('const userByAccessTokenData = ', userByAccessTokenData)

    if (!insertedSession) return false

    return {accessToken, refreshToken}
  },

  async saveSessionData() {

  },


  async updateAccessToken(prevRefreshToken: string) {
    const userId = await jwtService.getUserIdByRefreshToken(prevRefreshToken)
    if (!userId) return false

    const user = false //await usersService.getUserById(userId)
    // if (!user || user.refreshToken !== prevRefreshToken) return false

    // const accessToken = jwtService.generateAccessToken(user.id) //10s
    //
    // const refreshToken = jwtService.generateRefreshToken(user.id) //20s
    //
    // const newToken = await usersService.updateUser(userId, {refreshToken})
    // if (!newToken) return false
    //
    // return {accessToken, refreshToken}
  },

  async logoutUser(refreshToken: string) {
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (!userId) return false

    // const user = await usersService.getUserById(userId)
    // if (!user || user.refreshToken !== refreshToken) return false
    //
    // return await usersService.updateUser(userId, {refreshToken: null})

  }
}