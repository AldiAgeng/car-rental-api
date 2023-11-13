import { UsersModel } from "../databases/models/users";

export class UserRepository {
  static async create(user: any) {
    return await UsersModel.query().insert(user).returning("*");
  }

  static async show(payload: any) {
    return await UsersModel.query().findOne(payload);
  }

  static async update(userId: number, payload: any) {
    return await UsersModel.query().update(payload).where({ id: userId });
  }
}