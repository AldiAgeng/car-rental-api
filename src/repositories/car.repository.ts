import { CarsModel } from "../databases/models/cars";

export class CarRepository {
  static async list(query: any) {
    
    const { page, limit, search, sort, order, dateFilter,  capacityFilter} = query;
    const queryBuilder = CarsModel.query();

    if (search) {
      queryBuilder.whereILike("name", `%${search}%`);
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

    return await queryBuilder.withGraphFetched("[userCreated, userUpdated, userDeleted]");
  }

  static async listPublic(query: any) {
    const { page, limit, search, sort, order, dateFilter,  capacityFilter} = query;
    const queryBuilder = CarsModel.query().whereNotDeleted();

    if (search) {
      queryBuilder.whereILike("name", `%${search}%`);
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

    return await queryBuilder.withGraphFetched("[userCreated, userUpdated, userDeleted]");
  }

  static async show(id: number) {
    const car = await CarsModel.query().findById(id).withGraphFetched("[userCreated, userUpdated, userDeleted]").throwIfNotFound();
    return car;
  }

  static async create(car: any, userId: number) {
    const cars = await CarsModel.query().insert({
      ...car,
      created_by: userId
    }).returning("*");
    return cars;
  }

  static async update(id: number, car: any, userId: number) {
    return await CarsModel.query()
      .where({ id })
      .patch({
        ...car,
        updated_by: userId
      })
      .throwIfNotFound();
  }

  static async delete(id: number, userId: number) {
    return await CarsModel.transaction(async (trx) => {
      await CarsModel.query(trx)
      .where({ id })
      .patch({ deleted_by: userId })
      .throwIfNotFound();

      const deletedCars = await CarsModel.query(trx)
        .delete()
        .where({ id })
        .returning("*");

      return deletedCars;
    })
  }
}