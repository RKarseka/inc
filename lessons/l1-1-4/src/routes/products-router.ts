import { Request, Response, Router } from "express";

const products = [ {id: 1, title: 'tomato'}, {id: 2, title: 'orange'} ]

export const productsRouter = Router({})

productsRouter.get('/', (req: Request, res: Response) => {
  if (req.query.title) {
    const searchString = req.query.title.toString()
    res.send(products.filter(p => p.title.indexOf(searchString) > -1))
  } else {
    res.send(products)
  }
})

productsRouter.post('/', (req: Request, res: Response) => {
  const newProduct = {
    id: +(new Date()),
    title: req.body.title
  }

  products.push(newProduct)

  res.status(201).send(newProduct)
})

productsRouter.get('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const product = products.find(p => p.id === id)
  if (product) {
    res.send(product)
  } else {
    res.send(404)
  }
})

productsRouter.put('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const product = products.find(p => p.id === id)
  if (product) {
    product.title = req.body.title
    res.send(product)
  } else {
    res.send(404)
  }
})

productsRouter.delete('/:id', (req: Request, res: Response) => {
  const productIndex = products.findIndex(p => p.id === +req.params.id)
  if (productIndex !== -1) {
    products.splice(productIndex, 1)
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }

})