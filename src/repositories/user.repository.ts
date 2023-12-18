import { UsersModel, type Users } from '../databases/models/users'

export class UserRepository {
  async create (user: any): Promise<Users> {
    return await UsersModel.query().insert(user as Users).returning('*')
  }

  async show (payload: any): Promise<Users> {
    const user = await UsersModel.query().findOne(payload)
    return user as Users
  }

  async update (userId: number, payload: any): Promise<any> {
    return await UsersModel.query().update(payload as object).where({ id: userId })
  }
}
