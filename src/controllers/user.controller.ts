import { Response, Request } from "express";
import { ResponseHelper } from "../helpers/response.helper";
import { Users } from "../databases/models/users";
import { IUserReq } from "../interfaces/user.req.interface";
import { UserService } from "../services/user.service";

export class UserController extends ResponseHelper {
  async store(req: Request<{}, {}, Users>, res: Response) {
    try {
      const user = await UserService.create(req.body);

      return ResponseHelper.success("Data disimpan", user, 201)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 400)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async register(req: Request<{}, {}, Users>, res: Response) {
    try {
      const user = await UserService.create(req.body);

      return ResponseHelper.success("Data disimpan", user, 201)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 400)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async login(req: IUserReq, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.login(email, password);
  
      return ResponseHelper.success("Berhasil login", user, 200)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 401)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }
  
  async logout(req: IUserReq, res: Response) {
    try {
      const user = req.user;
  
      const userLogout = await UserService.logout(user);

      if (!userLogout) {
        return ResponseHelper.error("Logout gagal", null, 401)(res);
      }
  
      return ResponseHelper.success("Berhasil logout", null, 200)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 401)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async refreshToken(req: Request <{}, {token: string}, {refreshToken: string}>, res: Response) {
    try {
      const refresh_token = req.body.refreshToken;
  
      const token = await UserService.refreshToken(refresh_token);
  
      return ResponseHelper.success("Berhasil memperbarui token", {
        token,
      }, 200)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 401)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async whoami(req: IUserReq, res: Response) {
    try {
      return ResponseHelper.success("Berhasil mendapatkan data user", req.user, 200)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 401)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }
}