import cloudinary from 'cloudinary'
import { config } from 'dotenv'

config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME ?? 'dewpe0hc8',
  api_key: process.env.CLOUDINARY_API_KEY ?? '826876771189152',
  api_secret: process.env.CLOUDINARY_API_SECRET ?? '7UtsjzeqoMHes3YBqWdXpRl-VWc',
  secure: true
})

export default cloudinary.v2
