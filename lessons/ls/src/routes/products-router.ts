import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { inputValidationMiddleware } from "../middlewares/input-validation-midleware";
import { productsService } from "../domain/products-service";


export const productsRouter = Router({})

const titleValidation = body('title').trim().isLength({min: 3, max: 10}).withMessage('error message')

productsRouter.get('/', async (req: Request, res: Response) => {
  const foundProducts = await productsService.findProducts(req.query.title?.toString())
  res.send(foundProducts)
})

productsRouter.post('/', titleValidation, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    res.status(201).send(await productsService.createProduct(req.body.title))
  })

productsRouter.get('/:id',
  async (req: Request, res: Response) => {
    const product = await productsService.getProductById(+req.params.id)
    if (product) {
      res.send(product)
    } else {
      res.send(404)
    }
  })

productsRouter.put('/:id', titleValidation, inputValidationMiddleware,
  async (req: Request, res: Response) => {
    const isUpdated = await productsService.updateProduct(+req.params.id, req.body.title)
    res.send(isUpdated ? await productsService.getProductById(+req.params.id) : 404)
  })

productsRouter.delete('/:id',
  async (req: Request, res: Response) => {
    res.sendStatus(await productsService.deleteProduct(+req.params.id) ? 204 : 404)
  })