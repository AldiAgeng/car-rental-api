import { UserRepository } from '../repositories/user.repository'
import { hashPassword, comparePassword } from '../utils/bcrypt.password'
import { createToken, createRefreshToken } from '../utils/create.token'

export class UserService {
  public userRepository: UserRepository

  constructor () {
    this.userRepository = new UserRepository()
  }

  async create (user: any): Promise<any> {
    const isEmailExist = await this.userRepository.show({ email: user.email })

    if (isEmailExist !== undefined) {
      throw new Error('Email already exist')
    }

    user.password = await hashPassword(user.password as string)

    return await this.userRepository.create(user)
  }

  async register (user: any): Promise<any> {
    const isEmailExist = await this.userRepository.show({ email: user.email })

    if (isEmailExist !== undefined) {
      throw new Error('Email already exist')
    }

    user.password = await hashPassword(user.password as string)

    return await this.userRepository.create({
      ...user,
      role_id: 3
    })
  }

  async login (email: string, password: string): Promise<any> {
    const user = await this.userRepository.show({ email })

    if (user === undefined) {
      throw new Error('Email or password invalid')
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Email or password invalid')
    }

    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email
    })

    const refreshToken = createRefreshToken({
      id: user.id,
      name: user.name,
      email: user.email
    })

    await this.userRepository.update(user.id, {
      token,
      refresh_token: refreshToken
    })

    return {
      token,
      refresh_token: refreshToken
    }
  }

  async logout (user: any): Promise<any> {
    return await this.userRepository.update(user.id as number, {
      token: '',
      refresh_token: ''
    })
  }

  async refreshToken (refreshToken: string): Promise<any> {
    const user = await this.userRepository.show({ refresh_token: refreshToken })

    if (user === undefined) {
      throw new Error('Refresh token invalid')
    }

    const token = createToken({
      id: user.id,
      name: user.name,
      email: user.email
    })

    await this.userRepository.update(user.id, {
      token
    })

    return {
      token
    }
  }
}
