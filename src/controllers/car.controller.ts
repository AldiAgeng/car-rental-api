import { Response, Request } from "express";

import { Cars } from "../databases/models/cars";
import { IParams } from "../interfaces/id.interface";
import { ResponseHelper } from "../helpers/response.helper";
import { CarService } from "../services/car.service";
import { IUserReq } from "../interfaces/user.req.interface";


export class CarsController extends ResponseHelper {
  async list(req: Request, res: Response) {
    try {
      const cars = await CarService.list(req.query);

      return ResponseHelper.success("Data ditemukan", cars)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }
  
  async create(req: IUserReq, res: Response) {
    try {
      const body = req.body;
      const image = req.file;
      const car = await CarService.create(body, image, req.user?.id as number);
      return ResponseHelper.success("Data disimpan", car, 201)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 400)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async show(req: Request<IParams>, res: Response) {
    try {
      if(req.params.id === undefined){
        return ResponseHelper.error("Parameter id harus diisi", null, 400)(res);
      }
      const car = await CarService.show(+req.params.id);
      return ResponseHelper.success("Data ditemukan", car)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async update(req: IUserReq, res: Response) {
    try {
      if(req.params.id === undefined){
        return ResponseHelper.error("Parameter id harus diisi", null, 400)(res);
      }
      const body = req.body;
      const image = req.file;
      const id = +req.params.id;
      const cars = await CarService.update(id, body, image, req.user?.id as number);
      return ResponseHelper.success("Data diubah", cars, 200)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async delete(req: IUserReq, res: Response) {
    try {
      if(req.params.id === undefined){
        return ResponseHelper.error("Parameter id harus diisi", null, 400)(res);
      }
      const id = +req.params.id;
      await CarService.delete(id, req.user?.id as number);
      return ResponseHelper.success("Data dihapus")(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }
}
