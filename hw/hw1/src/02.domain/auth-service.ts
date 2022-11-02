import { usersRepository } from "../03.repositories/users-repository";

export const authService = {
  async checkAuth(loginOrEmail: string, password: string) {
    return await usersRepository.loginOne(loginOrEmail, loginOrEmail, password)
  }
}