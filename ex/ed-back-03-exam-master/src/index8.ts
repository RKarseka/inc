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
      type: 'smartphone'
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
      productPrice: 1600,
      type: 'laptop'
    }
  ])

  await ordersCollection.updateMany({type: 'smartphone'}, {$set: {productTitle: 'НЕТ В ПРОДАЖЕ'}})

  const result = await ordersCollection.find().toArray()
  console.log(result)
}

startApp()

/*
 У магазина вашего заказчика забрали лицензию на продажу смартфонов.
 Нужно для ВСЕХ смартфонов поставить в название 'НЕТ В ПРОДАЖЕ'. Допишите строку 66 вправо, чтобы произошло нужное обновление.
 Слева от await писать ничего не нужно
 В качестве ответа укажите 66 строку целиком  (можно писать объекты внутри с форматированием в несколько строк)
*/