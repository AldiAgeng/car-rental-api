declare namespace Express {
  export interface Request {
    user: {
      id: number
      name: string
      email: string
      password: string
      token: string
      refresh_token: string
      role_id: number
    }
  }
}
