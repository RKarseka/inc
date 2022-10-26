import { MongoClient, ObjectId, WithId } from 'mongodb'

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

let db = client.db('exam-03')

type OrderType = {
  _id: ObjectId // id заказа
  productId: ObjectId // id продукта
  productTitle: string // названия продукта заказа
  productPrice: number // цена продукта заказа
  productCount: number // кол-во заказов
  type: 'smartphone' | 'laptop' | 'display-monitor' // тип продукта
}

export const ordersCollection = db.collection<OrderType>('orders')

export async function startApp() {
  await client.connect()
  await ordersCollection.deleteMany({})
  await ordersCollection.insertMany([
    {
      _id: new ObjectId(),
      productId: new ObjectId(),
      productTitle: 'IPhone',
      productPrice: 1500,
      productCount: 10,
      type: 'laptop'
    },
    {
      _id: new ObjectId(),
      productId: new ObjectId(),
      productTitle: 'IPhone X',
      productPrice: 2000,
      productCount: 10,
      type: 'smartphone'
    },
    {
      _id: new ObjectId(),
      productId: new ObjectId(),
      productTitle: 'Galaxy',
      productCount: 2,
      productPrice: 400,
      type: 'smartphone'
    },
    {
      _id: new ObjectId(),
      productId: new ObjectId(),
      productTitle: 'Dell Monitor',
      productCount: 4,
      productPrice: 600,
      type: 'display-monitor'
    },
    {
      _id: new ObjectId(),
      productId: new ObjectId(),
      productTitle: 'Asus ZenBook',
      productCount: 2,
      productPrice: 1200,
      type: 'laptop'
    }
  ])

  const result = await ordersCollection.find({productTitle: {$regex: 'IPhone'}}).toArray()
  console.log(result)
}

startApp()

/*
Вместо XXX напишите объект-фильтр, чтобы найти все продукты, в названии которых есть вхождение 'IPhone' (должно быть найдено 2 продукта)
В качестве ответа укажите этот объект  (можно писать его с форматированием в несколько строк)
*/
