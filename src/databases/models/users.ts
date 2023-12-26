import { Model, type ModelObject } from 'objection'

export class UsersModel extends Model {
  id!: number
  name!: string
  email!: string
  password!: string
  token!: string
  refresh_token!: string
  role_id!: number

  protected static nameOfTable = 'users'
  static get tableName (): string {
    return this.nameOfTable
  }

  static get jsonSchema (): object {
    return {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 1, maxLength: 255 },
        role_id: { type: 'integer' }
      }
    }
  }

  static relationMappings = {
    carsCreated: {
      relation: Model.HasManyRelation,
      modelClass: 'CarsModel',
      join: {
        from: 'users.id',
        to: 'cars.created_by'
      }
    },
    carsUpdated: {
      relation: Model.HasManyRelation,
      modelClass: 'CarsModel',
      join: {
        from: 'users.id',
        to: 'cars.updated_by'
      }
    },
    carsDeleted: {
      relation: Model.HasManyRelation,
      modelClass: 'CarsModel',
      join: {
        from: 'users.id',
        to: 'cars.deleted_by'
      }
    }
  }
}

export type Users = ModelObject<UsersModel>
