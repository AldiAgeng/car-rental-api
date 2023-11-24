import { Model, ModelObject } from "objection";
import objectionSoftDelete from 'objection-js-soft-delete';
import { UsersModel } from "./users";

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null
})

export class CarsModel extends softDelete(Model) {
  id!: number;
  plate!: string;
  manufacture!: string;
  model!: string;
  image!: string;
  image_public_id!: string;
  rent_per_day!: number;
  capacity!: number;
  description!: string;
  available_at!: Date;
  transmission!: string;
  available!: boolean;
  type!: string;
  year!: number;
  options!: string;
  specs!: string;
  created_by!: number;
  updated_by!: number;
  deleted_by!: number;

  static get tableName() {
    return "cars";
  }

  static relationMappings = {
    userCreated: {
      relation: Model.BelongsToOneRelation,
      modelClass: UsersModel,
      join: {
        from: "cars.created_by",
        to: "users.id",
      }
    },
    userUpdated: {
      relation: Model.BelongsToOneRelation,
      modelClass: UsersModel,
      join: {
        from: "cars.updated_by",
        to: "users.id",
      }
    },
    userDeleted: {
      relation: Model.BelongsToOneRelation,
      modelClass: UsersModel,
      join: {
        from: "cars.deleted_by",
        to: "users.id",
      }
    }
  }
}

export type Cars = ModelObject<CarsModel>;
