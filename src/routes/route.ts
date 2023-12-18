import { Router } from 'express'
import express, { type Express } from 'express'
import { UserController } from '../controllers/user.controller'
import { CarsController } from '../controllers/car.controller'
import { authenticateToken, authenticateTokenAdmin, authenticateTokenSuperAdmin } from '../middlewares/authorization'
import upload from '../utils/upload.on.memory'

export const route = Router()
const app: Express = express()

const userController = new UserController(app)
const { login, refreshToken, logout, whoami, store, register, googleLogin } = userController

const carsController = new CarsController(app)
const { listPublic, list, create, show, update, delete: deleteCar } = carsController

// cars
route.get('/cars', authenticateTokenAdmin, list.bind(carsController))
route.post('/cars', authenticateTokenAdmin, upload.single('image'), create.bind(carsController))
route.get('/cars/public', listPublic.bind(carsController))
route.get('/cars/:id', authenticateTokenAdmin, show.bind(carsController))
route.patch('/cars/:id', authenticateTokenAdmin, upload.single('image'), update.bind(carsController))
route.delete('/cars/:id', authenticateTokenAdmin, deleteCar.bind(carsController))

// users
route.post('/users/login', login.bind(userController))
route.post('/users/refresh-token', refreshToken.bind(userController))
route.post('/users/logout', authenticateToken, logout.bind(userController))
route.get('/users/me', authenticateToken, whoami.bind(userController))

// super admin management users
route.post('/users', authenticateTokenSuperAdmin, store.bind(userController))

// users member
route.post('/users/member/register', register.bind(userController))

// oauth
route.post('/users/auth/google', googleLogin.bind(userController))

export default route
