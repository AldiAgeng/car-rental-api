import express, { type Express } from 'express'
import { Model } from 'objection'
import { config } from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './docs/swagger-docs.json'

import knexInstance from './databases'
import route from './routes/route'

config()

Model.knex(knexInstance)

class App {
  public app: Express = express()
  constructor () {
    this.app.use(morgan('combined'))
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())

    this.app.use('/api/v1', route)
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

    this.app.get('/', (req, res) => {
      res.status(200).json({
        code: 200,
        status: 'success',
        message: 'Welcome to Car Rental API',
        data: null
      })
    })

    this.app.use((req, res) => {
      res.status(404).json({
        code: 404,
        status: 'error',
        message: 'Route not found',
        data: null
      })
    })
  }
}

export default new App().app
