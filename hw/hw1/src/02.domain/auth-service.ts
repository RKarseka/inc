import {usersRepository} from "../03.repositories/users-repository";
import {bcryptService} from "../-application/bcrypt-service";
import {jwtService} from "../-application/jwt-service";
import {abstractRepository} from "../03.repositories/abstract-repository";
import {usersCollection} from "../03.repositories/db";
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

  async loginUser(loginOrEmail: string, password: string) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false

    const compare = await bcryptService.compare(password, user.passwordHash)
    if (!compare) return false

    const accessToken = jwtService.generateAccessToken(user.id) //10s

    const refreshToken = jwtService.generateRefreshToken(user.id) //20s

    const updateUserRefreshToken = await abstractRepository
      .updateOne(user.id, {refreshToken}, usersCollection)

    if (!updateUserRefreshToken) return false

    return {accessToken, refreshToken}
  },


  async updateAccessToken(prevRefreshToken: string) {
    const userId = await jwtService.getUserIdByRefreshToken(prevRefreshToken)
    if (!userId) return false

    const user = await usersService.getUserById(userId)
    if (!user || user.refreshToken !== prevRefreshToken) return false

    const accessToken = jwtService.generateAccessToken(user.id) //10s

    const refreshToken = jwtService.generateRefreshToken(user.id) //20s


    return {accessToken, refreshToken}
  },

  async logoutUser(refreshToken: string) {
    const userId = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (!userId) return false

    const user = await usersService.getUserById(userId)
    if (!user || user.refreshToken !== refreshToken) return false

    return await usersService.updateUser(userId, {refreshToken: null})

  }
}