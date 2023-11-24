import { Model, ModelObject } from "objection";

export class UsersModel extends Model {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  token!: string;
  refresh_token!: string;
  role_id!: number;

  static get tableName() {
    return "users";
  }

  static relationMappings = {
    carsCreated: {
      relation: Model.HasManyRelation,
      modelClass: "CarsModel",
      join: {
        from: "users.id",
        to: "cars.created_by"
      }
    },
    carsUpdated: {
      relation: Model.HasManyRelation,
      modelClass: "CarsModel",
      join: {
        from: "users.id",
        to: "cars.updated_by"
      }
    },
    carsDeleted: {
      relation: Model.HasManyRelation,
      modelClass: "CarsModel",
      join: {
        from: "users.id",
        to: "cars.deleted_by"
      }
    }
  }
  
}

export type Users = ModelObject<UsersModel>;
