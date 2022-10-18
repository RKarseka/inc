import 'dotenv/config'
import express, {Request, Response, NextFunction} from 'express'

// create express app
const app = express()

const port = process.env.PORT

app.use('/', (req: Request, res: Response) => {
    res.send("WORKS")
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})

