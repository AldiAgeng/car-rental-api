import { NotFoundError, ValidationError } from 'objection'
import { type Response } from 'express'

import { ResponseHelper } from './response.helper'

export class ErrorHelper {
  error?: any

  constructor (error?: any) {
    this.error = error
  }

  static handler (error: any, res: Response): void {
    if (error instanceof ValidationError) {
      ResponseHelper.error(error.message, error.data, 400)(res)
    } else if (error instanceof NotFoundError) {
      ResponseHelper.error(error.message, error.stack, 404)(res)
    } else if (error.message === 'Email or password invalid' || error.message === 'Email already exist' || error.message === 'Email or password invalid' || error.message === 'Refresh token invalid') {
      ResponseHelper.error(error.message, error.stack, 401)(res)
    } else if (error instanceof Error) {
      ResponseHelper.error(error.message, error.stack, 400)(res)
    } else {
      ResponseHelper.error(error.message, error, 500)(res)
    }
  }
}
