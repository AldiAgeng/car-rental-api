import cloudinary from '../utils/cloudinary'
import { type CloudinaryResult } from '../interfaces/cloudinary.interface'
export async function uploadImageToCloudinary (image: any, folder: string): Promise<CloudinaryResult> {
  const filBase64 = image.buffer.toString('base64')
  const fileUpload = `data:${image.mimetype};base64,${filBase64}`
  return await cloudinary.uploader.upload(fileUpload, {
    folder
  })
}

export async function deleteImageFromCloudinary (publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(`${publicId}`)
  } catch (error) {
    throw new Error(error as string)
  }
}
