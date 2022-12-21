import {usersRepository} from "../03.repositories/users-repository";
import {bcryptService} from "../-application/bcrypt-service";
import {IRefreshToken, jwtService} from "../-application/jwt-service";
import {usersSessionsRepository} from "../03.repositories/usersSessions-repository";
import {ObjectId} from "mongodb";
import {usersService} from "./users-service";

export interface IMe {
  email: string,
  login: string,
  userId: string
}

export const authService = {

  async checkAuth(loginOrEmail: string, password: string) {
    return await usersRepository.loginOne(loginOrEmail, loginOrEmail, password)
  },

  async loginUser(loginOrEmail: string, password: string, ip: string) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false

    const compare = await bcryptService.compare(password, user.passwordHash)
    if (!compare) return false

    const refreshTokenData = {id: new ObjectId() + '', ...jwtService.generateRefreshToken(user.id)} //20s
    const {refreshToken, deviceId} = refreshTokenData

    const accessToken = jwtService.generateAccessToken(user.id, deviceId) //10s

    const insertedSession = await usersSessionsRepository.insertSession({...refreshTokenData, ip, title: 'string'}, ip)

    if (!insertedSession) return false

    return {accessToken, refreshToken}
  },

  async saveSessionData() {

  },


  async updateAccessToken(prevRefreshToken: string) {
    const prevRefreshTokenData = await jwtService.getDataByRefreshToken(prevRefreshToken) as IRefreshToken | null
    if (!prevRefreshTokenData) return false

    const user = await usersService.getUserById(prevRefreshTokenData.userId)
    if (!user || user.refreshToken !== prevRefreshToken) return false

    const accessToken = jwtService.generateAccessToken(user.id, prevRefreshTokenData.deviceId) //10s

    const refreshToken = jwtService.generateRefreshToken(user.id) //20s

    const newToken = await usersService.updateUser(user.id, {refreshToken})
    if (!newToken) return false

    return {accessToken, refreshToken}
  },

  async logoutUser(refreshToken: string) {
    const refreshTokenData = await jwtService.getDataByRefreshToken(refreshToken) as IRefreshToken | null
    if (!refreshTokenData) return false

    const user = await usersService.getUserById(refreshTokenData.userId)
    if (!user || user.refreshToken !== refreshToken) return false

    return await usersService.updateUser(refreshTokenData.userId, {refreshToken: null})

  }
}