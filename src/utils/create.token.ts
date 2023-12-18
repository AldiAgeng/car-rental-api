import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

export const createToken = (payload: any): any => {
  return jwt.sign(payload as object, process.env.JWT_SECRET ?? 'Rahasia', {
    expiresIn: process.env.TOKEN_EXPIRE
  })
}

export const createRefreshToken = (payload: any): any => {
  return jwt.sign(payload as object, process.env.JWT_SECRET ?? 'Rahasia', {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE
  })
}
