import { usersCollection } from "./db"
import { IUser } from "../02.domain/users-service"

export const usersRepository = {
  async insertOne(newUser: IUser) {
    const res = await usersCollection.insertOne(newUser)
    //@todo
    console.log('const res = ', res)
    return
  },
  async deleteOne(id: string) {
    const result = await usersCollection.deleteOne({id})
    return !!result.deletedCount
  },
  async loginOne(login: string, email: string, password: string) {
    return await usersCollection.countDocuments({login, password}) ||
      await usersCollection.countDocuments({email, password})
  },
  async findByLoginOrEmail(loginOrEmail: string) {
    return await usersCollection.findOne({$or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
  }
}