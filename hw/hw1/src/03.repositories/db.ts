import {MongoClient} from "mongodb"
import * as dotenv from 'dotenv'
import {IBlog} from "./blogs-repository";
import {IPost} from "../02.domain/posts-service";
import {IUser} from "../02.domain/users-service";
import {IComment} from "../02.domain/comments-service";
import {IUserSessionData} from "../02.domain/security-service";

dotenv.config()

export type ProductType = {
  id: number,
  title: string
}

const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'
const local = ['RA-PC2021-E'].includes(process.env.COMPUTERNAME || '')
const client = new MongoClient(mongoUri)
// export const db = client.db('guild')
// export const db = client.db('forIncDB')
// export const db = client.db('secondDB')
export const db = local ? client.db('guild') : client.db('forIncDB')
export const videosCollection = db.collection<ProductType>('videos')
export const postsCollection = db.collection<IPost>('posts')
export const blogsCollection = db.collection<IBlog>('blogs')
export const usersCollection = db.collection<IUser>('users')
export const commentsCollection = db.collection<IComment>('comments')
export const usersSessionsCollection = db.collection<IUserSessionData>('usersSessions')

export async function runDb() {
  try {
    await client.connect()
    await client.db("products").command({ping: 1})
    console.log('Connected successfully to mongo server')
  } catch {
    console.log('Can`t connect to db')
    await client.close()
  }
}