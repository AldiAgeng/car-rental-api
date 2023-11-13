import jwt from "jsonwebtoken";

import { NextFunction, Response } from "express";
import { UsersModel, Users } from "../databases/models/users";
import { ResponseHelper } from "../helpers/response.helper";
import { IUserReq } from "../interfaces/user.req.interface";

export const authenticateToken: (
  req: IUserReq, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      throw {
        name: "Unauthorized",
      };
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = jwt.verify(tokenUser, "Rahasia") as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (!user) {
      return ResponseHelper.error("Email or password invalid", null, 401)(res);
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    });

    if (!isHavetoken) {
      return ResponseHelper.error("Email or password invalid", null, 401)(res);
    }

    req.user = user;
    next();
  } catch (error) {
    return ResponseHelper.error("Email or password invalid", null, 401)(res);
  }
};