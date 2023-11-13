import { Request } from "express";
import { Users } from "../databases/models/users";
export interface IUserReq extends Request {
  user?: Users;
}