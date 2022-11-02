import { usersRepository } from "../repositories/users-repository";
import { IGetParams } from "../helpers/helpers";
import { ObjectId } from "mongodb";

export interface IUser {
  id: string,
  login: string,
  email: string,
  createAt: string
}

interface ICreateUserParams {
  login: string,
  password: string,
  email: string
}

export const usersService = {
  async getAllUsers(params: IGetParams) {
    return await usersRepository.getAll(params)
  },
  async createUser({login, password, email}: ICreateUserParams) {
    const newUser = {
      id: new ObjectId() + '',
      login: login,
      password: password,
      email: email,
      createAt: new Date().toISOString()
    }
    await usersRepository.insertOne(newUser)
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createAt: newUser.createAt
    }
  },
  async deleteUser(id: string) {
    return await usersRepository.deleteOne(id)
  }
}