import { Request, Response, Router } from "express";
import { productsRepository } from "../repositories/products-repository";


export const productsRouter = Router({})

productsRouter.get('/', (req: Request, res: Response) => {
  const foundProducts = productsRepository.findProducts(req.query.title?.toString())
  res.send(foundProducts)
})

productsRouter.post('/', (req: Request, res: Response) => {
  res.status(201).send(productsRepository.createProduct(req.body.title))
})

productsRouter.get('/:id', (req: Request, res: Response) => {
  const product = productsRepository.getProductById(+req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.send(404)
  }
})

productsRouter.put('/:id', (req: Request, res: Response) => {
  const isUpdated = productsRepository.updateProduct(+req.params.id, req.body.title)
  res.send(isUpdated ? productsRepository.getProductById(+req.params.id) : 404)
})

productsRouter.delete('/:id', (req: Request, res: Response) => {
  res.sendStatus(productsRepository.deleteProduct(+req.params.id) ? 204 : 404)
})