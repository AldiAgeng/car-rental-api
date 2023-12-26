import { type Cars, CarsModel } from '../databases/models/cars'

export class CarRepository {
  async list (query: any): Promise<any> {
    const { page, limit, search, sort, order, dateFilter, capacityFilter } = query
    const queryBuilder = CarsModel.query().withGraphFetched('[userCreated(selectName), userUpdated(selectName), userDeleted(selectName)]').modifiers({
      selectName: (builder) => {
        return builder.select('name', 'email')
      }
    }).throwIfNotFound()

    if (search !== '') {
      await queryBuilder.whereILike('plate', `%${search}%`)
    }

    if (dateFilter !== '') {
      await queryBuilder.where('available_at', '>=', dateFilter as string)
    }

    if (capacityFilter !== '') {
      await queryBuilder.where('capacity', '>=', capacityFilter as string)
    }

    if (sort !== '') {
      if (order === 'asc' || order === 'desc') {
        await queryBuilder.orderBy(sort as string, order as 'asc' | 'desc')
      }
    }

    if (page !== '' && limit !== '') {
      await queryBuilder.page((+page - 1) * +limit, +limit)
    }

    return await queryBuilder
  }

  async listPublic (query: any): Promise<any> {
    const { page, limit, search, sort, order, dateFilter, capacityFilter } = query
    const queryBuilder = CarsModel.query().whereNotDeleted().withGraphFetched('[userCreated(selectName), userUpdated(selectName), userDeleted(selectName)]').modifiers({
      selectName: (builder) => {
        return builder.select('name', 'email')
      }
    }).throwIfNotFound()

    if (search !== '') {
      await queryBuilder.whereILike('plate', `%${search}%`)
    }

    if (dateFilter !== '') {
      await queryBuilder.where('available_at', '>=', dateFilter as string)
    }

    if (capacityFilter !== '') {
      await queryBuilder.where('capacity', '>=', capacityFilter as string)
    }

    if (sort !== '') {
      if (order === 'asc' || order === 'desc') {
        await queryBuilder.orderBy(sort as string, order as 'asc' | 'desc')
      }
    }

    if (page !== '' && limit !== '') {
      await queryBuilder.page((+page - 1) * +limit, +limit)
    }

    return await queryBuilder
  }

  async show (id: number): Promise<any> {
    const car = await CarsModel.query().findById(id).withGraphFetched('[userCreated(selectName), userUpdated(selectName), userDeleted(selectName)]').modifiers({
      selectName: (builder) => {
        return builder.select('name', 'email')
      }
    }).throwIfNotFound()
    return car
  }

  async create (car: Cars, userId: number): Promise<any> {
    const cars = await CarsModel.query().insert({ ...car, created_by: userId }).returning('*')
    return cars
  }

  async update (id: number, car: Cars, userId: number): Promise<any> {
    return await CarsModel.query()
      .where({ id })
      .patch({ ...car, updated_by: userId })
      .throwIfNotFound()
  }

  async delete (id: number, userId: number): Promise<any> {
    return await CarsModel.transaction(async (trx) => {
      await CarsModel.query(trx)
        .where({ id })
        .patch({ deleted_by: userId })
        .throwIfNotFound()

      const deletedCars = await CarsModel.query(trx)
        .delete()
        .where({ id })
        .returning('*')

      return deletedCars
    })
  }
}
