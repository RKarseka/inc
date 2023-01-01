import { ObjectId } from 'mongodb'

export class UserDBType {
  constructor (
    public _id: ObjectId,
    public userName: string,
    public bio: string,
    public addedAt: Date,
    public avatars: AvatarsDBType []
  ) {
  }
}

export interface AvatarsDBType {
  src: string
  addedAt: Date
}
