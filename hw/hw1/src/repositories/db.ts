import { MongoClient } from "mongodb"
import * as dotenv from 'dotenv'
import { IBlog } from "./blogs-repository";
import { IPost } from "./posts-repository";

dotenv.config()

export type ProductType = {
  id: number,
  title: string
}

const mongoUri = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017'

const client = new MongoClient(mongoUri)
const db = client.db('guild')
export const videosCollection = db.collection<ProductType>('videos')
export const postsCollection = db.collection<IPost>('posts')
export const blogsCollection = db.collection<IBlog>('blogs')
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