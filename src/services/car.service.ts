import { type Cars } from '../databases/models/cars'
import { CarRepository } from '../repositories/car.repository'
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../utils/file.manipulate'
export class CarService {
  carRepository: CarRepository

  constructor () {
    this.carRepository = new CarRepository()
  }

  async list (query: any): Promise<any> {
    const car = await this.carRepository.list(query)
    return car
  }

  async listPublic (query: any): Promise<any> {
    const car = await this.carRepository.listPublic(query)
    return car
  }

  async show (id: any): Promise<any> {
    const car = await this.carRepository.show(id as number)
    return car
  }

  async create (car: any, image: any, userId: number): Promise<any> {
    const optionsJson = JSON.stringify(car.options)
    const specsJson = JSON.stringify(car.specs)

    const result = await uploadImageToCloudinary(image, 'cars')

    const carPayload = {
      ...car,
      options: optionsJson,
      specs: specsJson,
      image_public_id: result.public_id,
      image: result.secure_url
    }

    const cars = await this.carRepository.create(carPayload as Cars, userId)
    return cars
  }

  async update (id: any, car: any, image: any, userId: number): Promise<any> {
    const optionsJson = JSON.stringify(car.options)
    const specsJson = JSON.stringify(car.specs)

    const carInDB = await this.carRepository.show(id as number)

    if (carInDB.image == null && carInDB.image_public_id == null) {
      const result = await uploadImageToCloudinary(image, 'cars')

      const carPayload = {
        ...car,
        options: optionsJson,
        specs: specsJson,
        image_public_id: result.public_id,
        image: result.secure_url
      }

      return await this.carRepository.update(id as number, carPayload as Cars, userId)
    }

    await deleteImageFromCloudinary(carInDB.image_public_id as string)

    const result = await uploadImageToCloudinary(image, 'cars')

    const carPayload = {
      ...car,
      options: optionsJson,
      specs: specsJson,
      image_public_id: result.public_id,
      image: result.secure_url
    }

    return await this.carRepository.update(id as number, carPayload as Cars, userId)
  }

  async delete (id: any, userId: number): Promise<any> {
    const carInDB = await this.carRepository.show(id as number)

    if (carInDB.image != null && carInDB.image_public_id != null) {
      await deleteImageFromCloudinary(carInDB.image_public_id as string)

      return await this.carRepository.delete(id as number, userId)
    }

    return await this.carRepository.delete(id as number, userId)
  }
}
