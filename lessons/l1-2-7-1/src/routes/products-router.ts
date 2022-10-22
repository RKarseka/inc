import { Request, Response, Router } from "express";
import { productsRepository } from "../repositories/products-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-midleware";


export const productsRouter = Router({})

const titleValidation = body('title').trim().isLength({min: 3, max: 10}).withMessage('error message')

productsRouter.get('/', (req: Request, res: Response) => {
  const foundProducts = productsRepository.findProducts(req.query.title?.toString())
  res.send(foundProducts)
})

productsRouter.post('/', titleValidation, inputValidationMiddleware,
  (req: Request, res: Response) => {
    res.status(201).send(productsRepository.createProduct(req.body.title))
  })

productsRouter.get('/:id',
  (req: Request, res: Response) => {
    const product = productsRepository.getProductById(+req.params.id)
    if (product) {
      res.send(product)
    } else {
      res.send(404)
    }
  })

productsRouter.put('/:id', titleValidation, inputValidationMiddleware,
  (req: Request, res: Response) => {
    const isUpdated = productsRepository.updateProduct(+req.params.id, req.body.title)
    res.send(isUpdated ? productsRepository.getProductById(+req.params.id) : 404)
  })

productsRouter.delete('/:id', (req: Request, res: Response) => {
  res.sendStatus(productsRepository.deleteProduct(+req.params.id) ? 204 : 404)
})