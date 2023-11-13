import { Model, ModelObject } from "objection";

export class UsersModel extends Model {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  token!: string;
  refresh_token!: string;

  static get tableName() {
    return "users";
  }
}

export type Users = ModelObject<UsersModel>;
