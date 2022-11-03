import { usersRepository } from "../03.repositories/users-repository";

export interface IMe {
  email: string,
  login: string,
  userId: string
}

export const authService = {
  async checkAuth(loginOrEmail: string, password: string) {
    return await usersRepository.loginOne(loginOrEmail, loginOrEmail, password)
  },
  async getMe() {

  }
}