import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { settings } from "../settings";

export const jwtService = {
  createJWT(userId: string) {
    return jwt.sign({ userId }, settings.JWT_SECRET, {expiresIn: '1h'})
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, settings.JWT_SECRET)
      return result.userId
    } catch (error) {
      return null
    }
  }
}