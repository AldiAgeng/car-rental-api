import { ArticleRepository } from "../repositories/article.repository";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../utils/file.manipulate";
export class ArticleService {

  static async list(query: any) {
    const article = await ArticleRepository.list(query);
    return article;
  }

  static async show(id: number) {
    const article = await ArticleRepository.show(id);
    return article;
  }

  static async create(article: any, image: any) {
    const result = await uploadImageToCloudinary(image, "articles");

    const articlePayload = {
      ...article,
      image_public_id: result.public_id,
      image: result.secure_url
    }

    const articles = await ArticleRepository.create(articlePayload);
    return articles;
  }

  static async update(id: number, article: any, image: any) {
    const articleInDB = await ArticleRepository.show(id);

    if (articleInDB.image == null && !articleInDB.image_public_id == null) {
        const result = await uploadImageToCloudinary(article.image, "articles");

        const articlePayload = {
            ...article,
            image_public_id: result.public_id,
            image: result.secure_url
        };

        return await ArticleRepository.update(id, articlePayload);
    }

    await deleteImageFromCloudinary(articleInDB.image_public_id);

    const result = await uploadImageToCloudinary(image, "articles");

    const articlePayload = {
        ...article,
        image_public_id: result.public_id,
        image: result.secure_url
    };

    return await ArticleRepository.update(id, articlePayload);
  }
  static async delete(id: number) {

    const articleInDB = await ArticleRepository.show(id);

    if (articleInDB.image && articleInDB.image_public_id) {
      await deleteImageFromCloudinary(articleInDB.image_public_id);

      return await ArticleRepository.delete(id);
    }

    return await ArticleRepository.delete(id);
  }
}