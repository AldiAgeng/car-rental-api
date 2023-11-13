import { UserRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/bcrypt.password";
import { ResponseHelper } from "../helpers/response.helper";
import { createToken, createRefreshToken } from "../utils/create.token";

export class UserService {
  static async create(user: any) {

    const isEmailExist = await UserRepository.show({ email: user.email });

    if (isEmailExist) {
      throw new Error("Email already exist");
    }

    user.password = await hashPassword(user.password) as string;

    return await UserRepository.create(user);
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.show({ email });
  
    if (!user) {
      throw new Error("Email or password invalid");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email or password invalid");
    }

    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    const refresh_token = createRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    await UserRepository.update(user.id, {
      token,
      refresh_token
    });

    return {
      token,
      refresh_token
    }
  }

  static async logout(user: any) {
    return await UserRepository.update(user.id, {
      token: "",
      refresh_token: ""
    });
  }

  static async refreshToken(refreshToken: string) {
    const user = await UserRepository.show({ refresh_token: refreshToken });

    if (!user) {
      throw new Error("Refresh token invalid");
    }

    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    await UserRepository.update(user.id, {
      token
    });

    return {
      token
    }
  }
}