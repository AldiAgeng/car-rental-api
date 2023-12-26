import { type Response, type Request, type Express } from 'express'
import { ResponseHelper } from '../helpers/response.helper'
import { type Users } from '../databases/models/users'
import { UserService } from '../services/user.service'
// import { OAuth2Client } from 'google-auth-library'
import { config } from 'dotenv'
import { ErrorHelper } from '../helpers/error.helper'

config()

// const ClientId = process.env.GOOGLE_CLIENT_ID
// const ClientSecret = process.env.GOOGLE_SECRET
// const oAuth2Client = new OAuth2Client(ClientId, ClientSecret, 'postmessage')

export class UserController {
  app: Express
  public userService: UserService

  constructor (app: Express) {
    this.app = app
    this.userService = new UserService()
  }

  // async googleLogin (req: Request, res: Response): Promise<void> {
  //   try {
  //     const { tokens } = await oAuth2Client.getToken(req.body.code as string)
  //     ResponseHelper.success('Berhasil login', tokens, 200)(res)
  //   } catch (error) {
  //     ErrorHelper.handler(error, res)
  //   }
  // }

  // async refreshTokenGoogle (req: Request, res: Response): Promise<void> {
  //   try {
  //     const user = new UserRefreshClient(
  //       ClientId,
  //       ClientSecret,
  //       req.body.refreshToken as string
  //     )
  //     const { credentials } = await user.refreshAccessToken()
  //     ResponseHelper.success('Data diambil', credentials, 201)(res)
  //   } catch (error) {
  //     ErrorHelper.handler(error, res)
  //   }
  // }

  async store (req: Request<Record<string, unknown>, Record<string, unknown>, Users>, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body)

      ResponseHelper.success('Data disimpan', user, 201)(res)
    } catch (error) {
      ErrorHelper.handler(error, res)
    }
  }

  async register (req: Request<Record<string, unknown>, Record<string, unknown>, Users>, res: Response): Promise<void> {
    try {
      const user = await this.userService.create(req.body)

      ResponseHelper.success('Data disimpan', user, 201)(res)
    } catch (error) {
      ErrorHelper.handler(error, res)
    }
  }

  async login (req: Request<Record<string, unknown>, Record<string, unknown>, Users>, res: Response): Promise<void> {
    try {
      const user = await this.userService.login(req.body.email, req.body.password)

      ResponseHelper.success('Berhasil login', user, 200)(res)
    } catch (error) {
      ErrorHelper.handler(error, res)
    }
  }

  async logout (req: Request, res: Response): Promise<void> {
    try {
      const user = req.user
      await this.userService.logout(user)

      ResponseHelper.success('Berhasil logout', null, 200)(res)
    } catch (error) {
      ErrorHelper.handler(error, res)
    }
  }

  async refreshToken (req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.body.refreshToken

      const token = await this.userService.refreshToken(refreshToken as string)

      ResponseHelper.success('Berhasil memperbarui token', {
        token
      }, 200)(res)
    } catch (error) {
      ErrorHelper.handler(error, res)
    }
  }

  async whoami (req: Request, res: Response): Promise<void> {
    try {
      ResponseHelper.success('Berhasil mendapatkan data user', req.user, 200)(res)
    } catch (error) {
      ErrorHelper.handler(error, res)
    }
  }
}
