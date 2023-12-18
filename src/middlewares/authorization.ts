import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

import { type NextFunction, type Response, type Request } from 'express'
import { UsersModel, type Users } from '../databases/models/users'
import { ResponseHelper } from '../helpers/response.helper'

config()

export const authenticateToken: (
  req: Request, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization
    if (bearerToken === undefined) {
      ResponseHelper.error('Bearer token not found', null, 401)(res)
      return
    }

    const tokenUser = bearerToken.split('Bearer ')[1]
    const tokenPayload = jwt.verify(tokenUser, process.env.JWT_SECRET ?? 'Rahasia') as Users

    const user = await UsersModel.query().findById(tokenPayload.id)
    if (user === undefined) {
      ResponseHelper.error('User notfound', null, 401)(res)
      return
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    })

    if (isHavetoken === undefined) {
      ResponseHelper.error('token notfound', null, 401)(res)
      return
    }

    req.user = user as Users
    next()
  } catch (error) {
    ResponseHelper.error('Email or password invalid', null, 401)(res)
  }
}

export const authenticateTokenSuperAdmin: (
  req: Request, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization
    if (bearerToken === undefined) {
      ResponseHelper.error('Email or password invalid', null, 401)(res)
      return
    }

    const tokenUser = bearerToken.split('Bearer ')[1]
    const tokenPayload = jwt.verify(tokenUser, process.env.JWT_SECRET ?? 'Rahasia') as Users

    const user = await UsersModel.query().findById(tokenPayload.id)
    if (user === undefined) {
      ResponseHelper.error('Email or password invalid', null, 401)(res)
      return
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    }).andWhere({
      role_id: 1
    })

    if (isHavetoken === undefined) {
      ResponseHelper.error('Email or password invalid', null, 401)(res)
      return
    }

    req.user = user as Users
    next()
  } catch (error) {
    ResponseHelper.error('Email or password invalid', null, 401)(res)
  }
}

export const authenticateTokenAdmin: (
  req: Request, res: Response, next: NextFunction
) => Promise<void> = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization
    if (bearerToken === undefined) {
      ResponseHelper.error('Email or password invalid', null, 401)(res)
      return
    }

    const tokenUser = bearerToken.split('Bearer ')[1]
    const tokenPayload = jwt.verify(tokenUser, process.env.JWT_SECRET ?? 'Rahasia') as Users

    const user = await UsersModel.query().findById(tokenPayload.id)
    if (user === undefined) {
      ResponseHelper.error('Email or password invalid', null, 401)(res)
      return
    }

    const isHavetoken = await UsersModel.query().findOne({
      token: tokenUser
    }).andWhereBetween('role_id', [1, 2])

    if (isHavetoken === undefined) {
      ResponseHelper.error('Email or password invalid', null, 401)(res)
      return
    }

    req.user = user as Users
    next()
  } catch (error) {
    ResponseHelper.error('Email or password invalid', null, 401)(res)
  }
}
