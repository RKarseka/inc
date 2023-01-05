import { ISearchFields, makeGetAllParams } from '../helpers/helpers'
import { ObjectId } from 'mongodb'
import { UsersRepository } from '../03.repositories/users-repository'
import { ParsedQs } from 'qs'
import { abstractRepository, mapFnDef } from '../03.repositories/abstract-repository'
import { usersCollection } from '../03.repositories/db'
import { bcryptService } from '../-application/bcrypt-service'
import { UserDBType } from '../types/types'
import { injectable } from 'inversify'

export interface IUserShort {
  userId: string
  login: string
  email: string
}

export interface IUser {
  id: string
  login: string
  email: string
  createdAt: string
  passwordHash: string
}

export interface IUserWithConfirmation extends IUser {
  isConfirmed: string
  confirmationCode: string
  refreshToken?: string
  recoveryCode?: string
}

type IUserSecure = Omit<IUser, 'passwordHash'>
export type IUserMe = Omit<IUserSecure, 'createdAt'>

interface ICreateUserParams {
  login: string
  password: string
  email: string
}

@injectable()
export class UserService {
  constructor (protected usersRepository: UsersRepository) {
  }

  async getAllUsers (query: ParsedQs) {
    const searchFields: Array<ISearchFields<IUserSecure>> = [
      { name: 'login', query: 'searchLoginTerm' },
      { name: 'email', query: 'searchEmailTerm' }
    ]
    const params = makeGetAllParams<IUserSecure>(query, searchFields)
    const mapFn = ({ id, login, email, createdAt }: IUserSecure): IUserSecure => ({ id, login, email, createdAt })
    return await abstractRepository.getAllFromCollectionPaginated<IUserSecure>(params, usersCollection, mapFn)
  }

  async updateUser (filterValue: string, user: {}, filter = 'id') {
    return await abstractRepository.updateOne(filterValue, user, usersCollection, filter)
  }

  async getUserById (id: string, mapFn = mapFnDef<IUserMe, IUserShort>) {
    return await abstractRepository.getOne<IUserWithConfirmation>(id, usersCollection, mapFn)
  }

  async getUserByEmail<T>(email: string, mapFn = mapFnDef<T, T>): Promise<T | null> {
    return await abstractRepository.getOne(email, usersCollection, mapFn, 'email')
  }

  async getUserByLogin<T>(login: string, mapFn = mapFnDef<T, T>): Promise<T | null> {
    return await abstractRepository.getOne(login, usersCollection, mapFn, 'login')
  }

  async getUserByCode<T>(code: string, mapFn = mapFnDef<T, T>): Promise<T | null> {
    return await abstractRepository.getOne(code, usersCollection, mapFn, 'confirmationCode')
  }

  async getUser<IUserWithConfirmation>(filterValue: string, filter = 'id', mapFn = mapFnDef<IUserWithConfirmation, IUserWithConfirmation>) {
    return await abstractRepository.getOne(filterValue, usersCollection, mapFn, filter)
  }

  async createUser ({ login, password, email }: ICreateUserParams, isConfirmed = false) {
    const passwordHash = await bcryptService.makePasswordHash(password)

    const newUserByClass = new UserDBType(new ObjectId(), login, '', new Date(), [])

    const newUser = {
      id: new ObjectId() + '',
      login,
      password,
      email,
      createdAt: new Date().toISOString(),
      passwordHash,
      isConfirmed,
      confirmationCode: new Date().toISOString(),
      confirmationCodeTime: new Date().toISOString()
    }
    await this.usersRepository.insertOne(newUser)
    return {
      id: newUser.id,
      login: newUser.login,
      email: newUser.email,
      createdAt: newUser.createdAt
    }
  }

  async setEmailConfirmationForUserByCode (user: IUserWithConfirmation) {
    return await abstractRepository
      .updateOne(
        user.confirmationCode,
        { ...user, isConfirmed: true, confirmationCode: null },
        usersCollection,
        'confirmationCode'
      )
  }

  async deleteUser (id: string) {
    return await this.usersRepository.deleteOne(id)
  }
}

export const usersService = new UserService(new UsersRepository())
