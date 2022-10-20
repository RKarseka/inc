import { Request, Response, Router } from "express"

const addresses = [ {id: 1, value: 'addr1'}, {id: 2, value: 'orlovskaya 7'} ]

export const addressesRouter = Router({})

addressesRouter.get('/', (req: Request, res: Response) => {
  res.send(addresses)
})

addressesRouter.get('/:id', (req: Request, res: Response) => {
  const id = +req.params.id
  const address = addresses.find(p => p.id === id)
  if (address) {
    res.send(address)
  } else {
    res.send(404)
  }
})