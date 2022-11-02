import { usersRepository } from "../repositories/users-repository";
import { IGetParams } from "../helpers/helpers";
import { ObjectId } from "mongodb";

export interface IUser {
  id: string,
  login: string,
  email: string,
  createdAt: string
}

interface ICreateUserParams {
  login: string,
  password: string,
  email: string
}

export const usersService = {
  async getAllUsers(query: IGetParams<IUser>) {
    return await usersRepository.getAll(query)
  },
  async createUser({login, password, email}: ICreateUserParams) {
    const newUser = {
      id: new ObjectId() + '',
      login: login,
      password: password,
      email: email,
      createdAt: new Date().toISOString()
    }
    await usersRepository.insertOne(newUser)
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  },
  async deleteUser(id: string) {
    return await usersRepository.deleteOne(id)
  }
}