import { Model, type ModelObject } from 'objection'

export class ArticlesModel extends Model {
  id!: number
  title!: string
  body!: string
  approved!: boolean
  image!: string
  image_public_id!: string

  protected static nameOfTable = 'articles'
  static get tableName (): string {
    return this.nameOfTable
  }
}

export type Articles = ModelObject<ArticlesModel>
