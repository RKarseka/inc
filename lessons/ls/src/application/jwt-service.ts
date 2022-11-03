import { UserDBType } from "../domain/user-service"
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";
import { settings } from "../settings";

export const jwtService = {
  async createJWT(user: UserDBType) {
    return jwt.sing({userId: user.id}, settings.JWT_SECRET, {expireIn: '1h'})
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return new ObjectId(result.userId)
    } catch (error) {
      return null
    }
  }
}