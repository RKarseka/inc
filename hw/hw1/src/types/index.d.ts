import { UserDBType } from "../domain/user-service";

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDBType | null
    }
  }
}