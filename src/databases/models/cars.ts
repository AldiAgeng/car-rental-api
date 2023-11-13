import { Model, ModelObject } from "objection";

export class CarsModel extends Model {
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

  static get tableName() {
    return "cars";
  }
}

export type Cars = ModelObject<CarsModel>;
