import { Response, Request } from "express";

import { Articles } from "../databases/models/articles";
import { IParams } from "../interfaces/id.interface";
import { ResponseHelper } from "../helpers/response.helper";
import { ArticleService } from "../services/article.service";


export class ArticlesController extends ResponseHelper {
  async list(req: Request, res: Response) {
    try {
      const articles = await ArticleService.list(req.query);

      return ResponseHelper.success("Data ditemukan", articles)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }
  
  async create(req: Request<{}, {}, Articles>, res: Response) {
    try {
      const body = req.body;
      const image = req.file;
      const article = await ArticleService.create(body, image);
      return ResponseHelper.success("Data disimpan", article, 201)(res);
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
      const article = await ArticleService.show(+req.params.id);
      return ResponseHelper.success("Data ditemukan", article)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async update(req: Request<IParams, {}, Partial<Articles>>, res: Response) {
    try {
      if(req.params.id === undefined){
        return ResponseHelper.error("Parameter id harus diisi", null, 400)(res);
      }
      const body = req.body;
      const image = req.file;
      const id = +req.params.id;
      const articles = await ArticleService.update(id, body, image);
      return ResponseHelper.success("Data diubah", articles, 200)(res);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHelper.error(error.message, null, 404)(res);
      } else {
        return ResponseHelper.error("An unknown error occurred")(res);
      }
    }
  }

  async delete(req: Request<IParams>, res: Response) {
    try {
      if(req.params.id === undefined){
        return ResponseHelper.error("Parameter id harus diisi", null, 400)(res);
      }
      const id = +req.params.id;
      await ArticleService.delete(id);
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
