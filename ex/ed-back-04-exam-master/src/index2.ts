import {MongoClient, ObjectId, WithId} from 'mongodb'

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

let db = client.db('exam-04')

type OrderType = {
    _id: ObjectId // id заказа
    productId: ObjectId // id продукта
    productTitle: string // названия продукта заказа
    address: { city: string }
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
            address: {city: 'Minsk'}
        },
        {
            _id: new ObjectId(),
            productId: new ObjectId(),
            productTitle: 'IPhone X',
            address: {city: 'Kiev'}
        },
        {
            _id: new ObjectId(),
            productId: new ObjectId(),
            productTitle: 'Galaxy',
            address: {city: 'Moscow'}
        },
        {
            _id: new ObjectId(),
            productId: new ObjectId(),
            productTitle: 'Dell Monitor',
            address: {city: 'Batumi'}
        },
        {
            _id: new ObjectId(),
            productId: new ObjectId(),
            productTitle: 'Asus ZenBook',
            address: {city: 'Batumi'}
        }
    ])

    const result = await ordersCollection.find({address:{city: 'Batumi'}}).toArray()
    console.log(result)
}

startApp()

/*
Вместо XXX напишите filter-объект для поиска всех товаров, доставленных в Batumi.
В качестве ответа дайте этот filter-объект (можно многострочно писать для удобства)
false
 */
