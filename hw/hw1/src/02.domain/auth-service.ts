import {usersRepository} from "../03.repositories/users-repository";
import bcrypt from "bcrypt";

export interface IMe {
  email: string,
  login: string,
  userId: string
}

export const authService = {
  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false
    const compare = await bcrypt.compare(password, user.passwordHash)
    if (!compare) return false
    return user
  },
  async checkAuth(loginOrEmail: string, password: string) {
    return await usersRepository.loginOne(loginOrEmail, loginOrEmail, password)
  }
}