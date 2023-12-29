import knex from 'knex'
import dotenv from 'dotenv'

dotenv.config()

const knexInstance = knex({
  client: process.env.DB_CLIENT,
  connection: process.env.DATABASE_URL
})

export default knexInstance
