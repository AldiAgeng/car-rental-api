import { Model, ModelObject } from "objection";

export class RolesModel extends Model {
  id!: number;
  name!: string;
  description!: string;

  static get tableName() {
    return "roles";
  }
}

export type Roles = ModelObject<RolesModel>;
