import { CarRepository } from "../repositories/car.repository";
import { uploadImageToCloudinary, deleteImageFromCloudinary } from "../utils/file.manipulate";
export class CarService {

  static async list(query: any) {
    const car = await CarRepository.list(query);
    return car;
  }

  static async show(id: number) {
    const car = await CarRepository.show(id);
    return car;
  }

  static async create(car: any, image: any) {
    const optionsJson = JSON.stringify(car.options);
    const specsJson = JSON.stringify(car.specs);

    const result = await uploadImageToCloudinary(image, "cars");

    const carPayload = {
      ...car,
      options: optionsJson,
      specs: specsJson,
      image_public_id: result.public_id,
      image: result.secure_url
    }

    const cars = await CarRepository.create(carPayload);
    return cars;
  }

  static async update(id: number, car: any, image: any) {
    const optionsJson = JSON.stringify(car.options);
    const specsJson = JSON.stringify(car.specs);

    const carInDB = await CarRepository.show(id);

    if (carInDB.image == null && carInDB.image_public_id == null) {
        const result = await uploadImageToCloudinary(image, "cars");

        const carPayload = {
            ...car,
            options: optionsJson,
            specs: specsJson,
            image_public_id: result.public_id,
            image: result.secure_url
        };

        return await CarRepository.update(id, carPayload);
    }

    await deleteImageFromCloudinary(carInDB.image_public_id);

    const result = await uploadImageToCloudinary(image, "cars");

    const carPayload = {
        ...car,
        options: optionsJson,
        specs: specsJson,
        image_public_id: result.public_id,
        image: result.secure_url
    };

    return await CarRepository.update(id, carPayload);
  }
  static async delete(id: number) {

    const carInDB = await CarRepository.show(id);

    if (carInDB.image && carInDB.image_public_id) {
      await deleteImageFromCloudinary(carInDB.image_public_id);

      return await CarRepository.delete(id);
    }

    return await CarRepository.delete(id);
  }
}