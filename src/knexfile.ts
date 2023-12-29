import type { Knex } from 'knex'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(__dirname, '../.env') })

const config: Record<string, Knex.Config> = {
  development: {
    client: process.env.DB_CLIENT,
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './databases/migrations'
    },
    seeds: {
      directory: './databases/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DB_CONNECTION,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './databases/migrations'
    },
    seeds: {
      directory: './databases/seeds'
    }
  }
}

module.exports = config
