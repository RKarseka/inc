import { userCollection } from "./db";
import { ObjectId } from "mongodb";
import { UserDBType } from "../domain/user-service";

export const userRepository = {
  async findByLoginOrEmail(loginOrEmail: string) {
    return await userCollection.findOne({$or: [ {email: loginOrEmail}, {userName: loginOrEmail} ]})
  },
  async createUser(newUser: UserDBType): Promise<UserDBType> {
    await userCollection.insertOne(newUser)
    return newUser
  },
  async findUserById(_id: ObjectId): Promise<UserDBType | null> {
    const product = await userCollection.findOne({_id})
    return product || null
  },
  async getAllUsers(): Promise<UserDBType[]> {
    return userCollection
      .find()
      .sort('createAt', -1)
      .toArray()
  }
}