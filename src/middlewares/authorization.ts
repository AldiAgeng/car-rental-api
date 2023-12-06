import jwt from "jsonwebtoken";
import { config } from "dotenv";

import { NextFunction, Response } from "express";
import { UsersModel, Users } from "../databases/models/users";
import { ResponseHelper } from "../helpers/response.helper";
import { IUserReq } from "../interfaces/user.req.interface";

config();

export const authenticateToken: (
  req: IUserReq, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      ResponseHelper.error("Bearer token not found", null, 401)(res);
      return
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = jwt.verify(tokenUser, process.env.JWT_SECRET || "Rahasia") as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (!user) {
      ResponseHelper.error("User notfound", null, 401)(res);
      return
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    });

    if (!isHavetoken) {
      ResponseHelper.error("token notfound", null, 401)(res);
      return
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    console.log("error hahaha");
    ResponseHelper.error("Email or password invalid", null, 401)(res);
    return
  }
};


export const authenticateTokenSuperAdmin: (
  req: IUserReq, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      ResponseHelper.error("Email or password invalid", null, 401)(res);
      return
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = jwt.verify(tokenUser, process.env.JWT_SECRET || "Rahasia") as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (!user) {
      ResponseHelper.error("Email or password invalid", null, 401)(res);
      return
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    }).andWhere({
      role_id: 1
    })

    if (!isHavetoken) {
      ResponseHelper.error("Email or password invalid", null, 401)(res);
      return
    }

    req.user = user;
    next();
  } catch (error) {
    return ResponseHelper.error("Email or password invalid", null, 401)(res);
  }
};

export const authenticateTokenAdmin: (
  req: IUserReq, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
      ResponseHelper.error("Email or password invalid", null, 401)(res);
      return
    }

    const tokenUser = bearerToken.split("Bearer ")[1];
    const tokenPayload = jwt.verify(tokenUser, process.env.JWT_SECRET || "Rahasia") as Users;

    const user = await UsersModel.query().findById(tokenPayload.id);
    if (!user) {
      ResponseHelper.error("Email or password invalid", null, 401)(res);
      return
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    }).andWhereBetween('role_id', [1, 2])

    if (!isHavetoken) {
      ResponseHelper.error("Email or password invalid", null, 401)(res);
      return
    }

    req.user = user;
    next();
  } catch (error) {
    return ResponseHelper.error("Email or password invalid", null, 401)(res);
  }
};