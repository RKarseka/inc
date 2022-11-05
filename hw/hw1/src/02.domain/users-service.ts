import bcrypt from "bcrypt"
import {IGetParams, ISearchFields, makeGetAllParams} from "../helpers/helpers";
import {ObjectId} from "mongodb";
import {usersRepository} from "../03.repositories/users-repository";
import {IPost} from "./posts-service";
import {ParsedQs} from "qs";
import {abstractRepository, mapFnDef} from "../03.repositories/abstract-repository";
import {usersCollection} from "../03.repositories/db";
import {IComment} from "./comments-service";

export interface IUser {
  id: string,
  login: string,
  email: string,
  createdAt: string,
  passwordHash: string
}

type IUserSecure = Omit<IUser, "passwordHash">
export type IUserMe = Omit<IUserSecure, "createdAt">

interface ICreateUserParams {
  login: string,
  password: string,
  email: string
}

export const usersService = {
  async getAllUsers(query: ParsedQs) {
    const searchFields: ISearchFields<IUserSecure>[] = [
      {name: 'login', query: 'searchLoginTerm'},
      {name: 'email', query: 'searchEmailTerm'}
    ]
    const params = makeGetAllParams<IUserSecure>(query, searchFields)
    const mapFn = ({id, login, email, createdAt}: IUserSecure): IUserSecure => ({id, login, email, createdAt})
    return await abstractRepository.getAllFromCollection<IUserSecure>(params, usersCollection, mapFn)
  },
  async getUserById<T>(id: string, mapFn = mapFnDef<T>): Promise<T | null> {
    return await abstractRepository.getOne(id, usersCollection, mapFn)

  },
  async createUser({login, password, email}: ICreateUserParams) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    const newUser = {
      id: new ObjectId() + '',
      login: login,
      password: password,
      email: email,
      createdAt: new Date().toISOString(),
      passwordHash
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
  },
}