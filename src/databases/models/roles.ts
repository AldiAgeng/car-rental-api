import { Model, type ModelObject } from 'objection'

export class RolesModel extends Model {
  id!: number
  name!: string
  description!: string

  protected static nameOfTable = 'roles'
  static get tableName (): string {
    return this.nameOfTable
  }
}

export type Roles = ModelObject<RolesModel>
