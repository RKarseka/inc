import {MongoClient, ObjectId, WithId} from 'mongodb'

const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoUri)

let db = client.db('exam-03')

type OrderType = {
    _id: ObjectId // id заказа
    productId: ObjectId // id продукта
    productTitle: string // названия продукта заказа
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
            coupons: [{title: 'SUMMER2022', percent: 5}, {title: 'BLACK-FRIDAY', percent: 30}]
        },
        {
            _id: ids[1],
            productId: new ObjectId(),
            productTitle: 'IPhone X',
            coupons: []
        },
        {
            _id: ids[2],
            productId: new ObjectId(),
            productTitle: 'Galaxy',
            coupons: []
        },
        {
            _id: ids[3],
            productId: new ObjectId(),
            productTitle: 'Dell Monitor',
            coupons: [{title: 'NEW-YEAR', percent: 2}]
        },
        {
            _id: ids[4],
            productId: new ObjectId(),
            productTitle: 'Asus ZenBook',
            coupons: [{title: 'IT-INCUBATOR', percent: 10}, {title: 'NEW-YEAR', percent: 2}]
        }
    ])

    const ordersWithCouponGreatThan8Percent = await ordersCollection.find({coupons:{percent:{$gt:8}}}).toArray()

    console.log(ordersWithCouponGreatThan8Percent)
}

startApp()

/*
Найдите заказы, на которые есть хоть один купон со скидкой более 8%.

В качестве ответа дайте этот filter-объект (можно многострочно писать для удобства)
false
*/