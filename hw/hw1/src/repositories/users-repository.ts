import { usersCollection } from "./db";
import { IUser } from "../domain/users-service";
import { getAllFromCollection, IGetParams, IPagedRes } from "../helpers/helpers";

export const usersRepository = {
  async getAll(params: IGetParams): Promise<IPagedRes<IUser>> {
    const res: IPagedRes<IUser> = await getAllFromCollection(params, usersCollection)

    return res
  },
  async insertOne(newUser: IUser) {
    const res = await usersCollection.insertOne(newUser)
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
  }
}