import {MongoClient, ObjectId, WithId} from 'mongodb'

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

let db = client.db('exam-04')

type OrderType = {
    _id: ObjectId // id заказа
    title: string // id продукта
}

export const ordersCollection = db.collection<OrderType>('orders')

export async function startApp() {
    await client.connect()
    await ordersCollection.deleteMany({})

    const products = [...new Array(300)].map((_, index) => ({_id: new ObjectId(), title: 'product' + index}))

    await ordersCollection.insertMany(products)

    const page = 5 // 1-based indexing
    const pageSize = 25

    const result = await ordersCollection.find().skip((page - 1) * pageSize).limit(pageSize).toArray()
    console.log(result)
}

startApp()

/*
В переменных page и pageSize заданы запрашиваемае страница и размер страницы.
Вместо X и Y нужно написать правильные "формулы" (с участием переменных page и pageSize)
В качестве ответа дайте полную 27 строку
pass
*/