import bcrypt from "bcrypt"
import {ISearchFields, makeGetAllParams} from "../helpers/helpers";
import {ObjectId} from "mongodb";
import {usersRepository} from "../03.repositories/users-repository";
import {ParsedQs} from "qs";
import {abstractRepository, mapFnDef} from "../03.repositories/abstract-repository";
import {usersCollection} from "../03.repositories/db";

export interface IUser {
  id: string,
  login: string,
  email: string,
  createdAt: string,
  passwordHash: string,
}

export interface IUserWithConfirmation extends IUser {
  isConfirmed: string,
  confirmationCode: string
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

  async getUserByEmail<T>(email: string, mapFn = mapFnDef<T>): Promise<T | null> {
    return await abstractRepository.getOne(email, usersCollection, mapFn, 'email')
  },

  async getUserByCode<T>(code: string, mapFn = mapFnDef<T>): Promise<T | null> {
    return await abstractRepository.getOne(code, usersCollection, mapFn, 'confirmationCode')
  },

  async getUserByEmailOrPassword<T>(code: string, mapFn = mapFnDef<T>): Promise<T | null> {
    return await abstractRepository.getOne(code, usersCollection, mapFn, 'confirmationCode')
  },

  async createUser({login, password, email}: ICreateUserParams, isConfirmed = false) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    const newUser = {
      id: new ObjectId() + '',
      login: login,
      password: password,
      email: email,
      createdAt: new Date().toISOString(),
      passwordHash,
      isConfirmed,
      confirmationCode: new Date().toISOString(),
      confirmationCodeTime: new Date().toISOString()
    }
    await usersRepository.insertOne(newUser)
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  },

  async setEmailConfirmationForUserByCode(user: IUserWithConfirmation) {
    return await abstractRepository.updateOne(
      user.confirmationCode,
      {...user, isConfirmed: true},
      usersCollection,
      'confirmationCode'
    )
  },

  async updateConfirmationCode(user: IUserWithConfirmation): Promise<string | false> {
    const confirmationCode = new Date().toISOString()
    return await abstractRepository.updateOne(user.id, {...user, confirmationCode}, usersCollection) && confirmationCode
  },

  async deleteUser(id: string) {
    return await usersRepository.deleteOne(id)
  }
}