import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { userRepository } from "../repositories/user-repository";

export type UserDBType = {}
export const userService = {
  async createUser(login: string, email: string, password: string)Promise<UserDBType> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await this._generateHash(password, passwordSalt)

    const newUser: UserDBType = {
      _id: new ObjectId(),
      userName: login,
      email,
      passwordHash,
      passwordSalt,
      createdAt: new Date()
    }
    return userRepository.createUser(newUser)
  },
  async findUserById(id: ObjectId): Promise<UserDBType | null> {
  },
  async checkCredentials(loginOrEmail: string, salt: string) {
    const user = await userRepository.findByLoginOrEmail(loginOrEmail)
    if (!user) return false
    const passwordHash = await this._generateHash(password, user.passwordSalt)
    if (user.passwordHash !== passwordHash) return false
    return true
  },
  async _generateHash(password: string, salt: string) {
    const hash = await bcrypt.hash(password, salt)
  }
}