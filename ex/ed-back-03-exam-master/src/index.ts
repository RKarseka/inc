import {MongoClient, ObjectId, WithId} from 'mongodb'

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

let db = client.db('exam-03')

type OrderType = {
  _id: ObjectId // id заказа
  productId: ObjectId // id продукта
  productTitle: string // названия продукта заказа
  productPrice: number // цена продукта заказа
  productCount: number // кол-во заказов
  type: 'smartphone' | 'laptop' | 'display-monitor' // тип продукта,
  coupons: { title: string, percent: number }[] // скидочные купоны
}

export const ordersCollection = db.collection<OrderType>('orders')

export async function startApp() {
  await client.connect()
  await ordersCollection.deleteMany({})
  const ids = [new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId(), new ObjectId()]
  await ordersCollection.insertMany([
    {
      _id: ids[0],
      productId: new ObjectId(),
      productTitle: 'IPhone',
      productPrice: 1500,
      productCount: 10,
      type: 'smartphone',
      coupons: [{title: 'SUMMER2022', percent: 5}, {title: 'BLACK-FRIDAY', percent: 30}]
    },
    {
      _id: ids[1],
      productId: new ObjectId(),
      productTitle: 'IPhone X',
      productPrice: 2000,
      productCount: 10,
      type: 'smartphone',
      coupons: []
    },
    {
      _id: ids[2],
      productId: new ObjectId(),
      productTitle: 'Galaxy',
      productCount: 2,
      productPrice: 400,
      type: 'smartphone',
      coupons: []
    },
    {
      _id: ids[3],
      productId: new ObjectId(),
      productTitle: 'Dell Monitor',
      productCount: 4,
      productPrice: 600,
      type: 'display-monitor',
      coupons: []
    },
    {
      _id: ids[4],
      productId: new ObjectId(),
      productTitle: 'Asus ZenBook',
      productCount: 2,
      productPrice: 1600,
      type: 'laptop',
      coupons: []
    }
  ])

  const zenbook = await ordersCollection.findOneAndUpdate({_id:ids[4]},{$set:{coupons:[{title: 'IT-INCUBATOR', percent: 10}]}}, {returnDocument: 'after'  })
  // await ordersCollection.updateMany({type: 'smartphone'}, {$set: {productTitle: 'НЕТ В ПРОДАЖЕ'}})

  console.log(zenbook.value)
}

startApp()

/*
Каждому товару мы добавили массив со скидочными купонами.
Нужно дописать 73 строку, чтобы, зная ID заказа с Zenbook (ids[4]), одним запросом в монгошку добавить купон {title: 'IT-INCUBATOR', percent: 10}
и получить назад обновлённый документ (с этим купоном внутри). Подсказка: обратите внимание на 3 параметр функции findOneAndUpdate.

В качестве ответа укажите 73 строку целиком (можно писать объекты внутри с форматированием в несколько строк)
*/