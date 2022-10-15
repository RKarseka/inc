import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import bodyParser from "body-parser"

// create express app
const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

const port = process.env.PORT || 5000

const products = [ {id: 1, title: 'tomato'}, {id: 2, title: 'orange'} ]
const addresses = [ {id: 1, value: 'addr1'}, {id: 2, value: 'orlovskaya 7'} ]

app.get('/products', (req: Request, res: Response) => {
  if (req.query.title) {
    const searchString = req.query.title.toString()
    res.send(products.filter(p => p.title.indexOf(searchString) > -1))
  } else {
    res.send(products)
  }
})

app.post('/products', (req: Request, res: Response) => {
  const newProduct = {
    id: +(new Date()),
    title: req.body.title
  }

  products.push(newProduct)

  res.status(201).send(newProduct)
})

app.get('/products/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const product = products.find(p => p.id === id)
  if (product) {
    res.send(product)
  } else {
    res.send(404)
  }
})

app.put('/products/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const product = products.find(p => p.id === id)
  if (product) {
    product.title = req.body.title
    res.send(product)
  } else {
    res.send(404)
  }
})

app.delete('/products/:id', (req: Request, res: Response) => {
  const productIndex = products.findIndex(p => p.id === +req.params.id)
  if (productIndex !== -1) {
    products.splice(productIndex, 1)
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }

})

app.get('/addresses', (req: Request, res: Response) => {
  res.send(addresses)
})

app.get('/addresses/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const address = addresses.find(p => p.id === id)
  if (address) {
    res.send(address)
  } else {
    res.send(404)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port: ${ port }`)
})

