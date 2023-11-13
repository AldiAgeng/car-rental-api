import { CarsModel } from "../databases/models/cars";

export class CarRepository {
  static async list(query: any) {
    
    const { page, limit, search, sort, order, dateFilter,  capacityFilter} = query;
    const queryBuilder = CarsModel.query();

    if (search) {
      queryBuilder.whereILike("name", `%${search}%`).whereILike("size", `%${search}%`);
    }

    if (dateFilter) {
      queryBuilder.where('available_at', '>=', dateFilter);
    }

    if (capacityFilter) {
      queryBuilder.where('capacity', '>=', capacityFilter);
    }

    if (sort) {
      if (order === "asc" || order === "desc") {
        queryBuilder.orderBy(sort, order)
      }
    }

    if (page && limit) {
      queryBuilder.page((+page - 1) * +limit, +limit);
    }

    return await queryBuilder;
  }

  static async show(id: number) {
    const car = await CarsModel.query().findById(id).throwIfNotFound();
    return car;
  }

  static async create(car: any) {
    const cars = await CarsModel.query().insert(car).returning("*");
    return cars;
  }

  static async update(id: number, car: any) {
    const cars = await CarsModel.query()
      .where({ id })
      .patch(car)
      .throwIfNotFound()
      .returning("*");
    return cars;
  }

  static async delete(id: number) {
    const cars = await CarsModel.query()
      .where({ id })
      .del()
      .throwIfNotFound()
      .returning("*");
    return cars;
  }
}