import { IGetParams, ISearchFields, makeGetAllParams } from "../helpers/helpers";
import { ObjectId } from "mongodb";
import { usersRepository } from "../03.repositories/users-repository";
import { IPost } from "./posts-service";
import { ParsedQs } from "qs";
import { abstractRepository } from "../03.repositories/abstract-repository";
import { usersCollection } from "../03.repositories/db";

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
  async getAllUsers(query: ParsedQs) {
    const searchFields: ISearchFields<IUser>[] = [
      {name: 'login', query: 'searchLoginTerm'},
      {name: 'email', query: 'searchEmailTerm'}
    ]
    const params = makeGetAllParams<IUser>(query, searchFields)
    const mapFn = ({id, login, email, createdAt}: IUser): IUser => ({id, login, email, createdAt})
    const users = await abstractRepository.getAllFromCollection<IUser>(params, usersCollection, mapFn)
    return
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