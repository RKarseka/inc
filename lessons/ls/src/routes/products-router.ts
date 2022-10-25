import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { productsRepository } from "../repositories/products-db-repository";


export const productsRouter = Router({})

const titleValidation = body('title').trim().isLength({min: 3, max: 10}).withMessage('error message')

productsRouter.get('/', async (req: Request, res: Response) => {
  const foundProducts = await productsRepository.findProducts(req.query.title?.toString())
  res.send(foundProducts)
})

productsRouter.post('/', titleValidation, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.status(201).send(await productsRepository.createProduct(req.body.title))
  })

productsRouter.get('/:id',
  async (req: Request, res: Response) => {
    const product = await productsRepository.getProductById(+req.params.id)
    if (product) {
      res.send(product)
    } else {
      res.send(404)
    }
  })

productsRouter.put('/:id', titleValidation, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isUpdated = await productsRepository.updateProduct(+req.params.id, req.body.title)
    res.send(isUpdated ? await productsRepository.getProductById(+req.params.id) : 404)
  })

productsRouter.delete('/:id',
  async (req: Request, res: Response) => {
    res.sendStatus(await productsRepository.deleteProduct(+req.params.id) ? 204 : 404)
  })