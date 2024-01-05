import supertest from 'supertest'
import { beforeAll, afterAll, it, expect, describe } from 'vitest'
import { UsersModel } from '../databases/models/users'
import { hashPassword } from '../utils/bcrypt.password'
import server from '../server'

const app = supertest(server)

beforeAll(async () => {
  try {
    await UsersModel.query().insert({ id: 999, name: 'testuser', email: 'testuser@yopmail.com', password: await hashPassword('testuser') })
  } catch (err) {
    console.log(err)
  }
})

afterAll(async () => {
  try {
    await UsersModel.query().delete().whereIn('email', ['testuser@yopmail.com', 'testuser2@yopmail.com', 'testuser3@yopmail.com']).throwIfNotFound()
  } catch (err) {
    console.log(err)
  }
})

// describe('[POST] Google Login', () => {
//   // const codeFE = vi.fn()
//   // it('should successfully login', async () => {
//   //   const result = await app.post('/api/v1/users/auth/google').send({
//   //     code: codeFE
//   //   })
//   //   // expect(result.status).toBe(201)
//   //   expect(result.body.message).toBe('Berhasil login')
//   // })

//   it('should be invalid code', async () => {
//     const result = await app.post('/api/v1/users/auth/google').send({ code: 'failcode' })
//     expect(result.status).toBe(400)
//     expect(result.body.message).toBe('invalid_grant')
//   })

//   it('should be error code null', async () => {
//     const result = await app.post('/api/v1/users/auth/google').send({ code: null })
//     expect(result.status).toBe(400)
//     expect(result.body.message).toBe('Cannot read properties of null (reading \'code\')')
//   })
// })

describe('[POST] register', () => {
  it('should successfully register', async () => {
    const result = await app.post('/api/v1/users/member/register').send({
      name: 'testuser2',
      email: 'testuser2@yopmail.com',
      password: await hashPassword('testuser2')
    })
    console.log('ini result', result.body)
    console.log('hasil', result.body.message)
    expect(result.status).toBe(201)
    expect(result.body.message).toBe('Data disimpan')
  })

  it('should be bad request', async () => {
    const result = await app.post('/api/v1/users/member/register').send({
      email: null,
      name: 'testuser2',
      password: await hashPassword('testuser2')
    })
    expect(result.status).toBe(400)
  })

  it('should be email already exist', async () => {
    const result = await app.post('/api/v1/users/member/register').send({
      name: 'testuser2',
      email: 'testuser2@yopmail.com',
      password: await hashPassword('testuser2')
    })
    console.log('hasil', result.body.message)
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email already exist')
  })
})

describe('[POST] store', () => {
  let mockToken: string
  beforeAll(async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'superadmincar@yopmail.com',
      password: 'superadmincar'
    })
    mockToken = result.body.data.token
  })

  it('should successfully store', async () => {
    const result = await app.post('/api/v1/users').send({
      name: 'testuser3',
      email: 'testuser3@yopmail.com',
      password: await hashPassword('testuser3')
    }).set({
      Authorization: `Bearer ${mockToken}`
    })

    expect(result.status).toBe(201)
    expect(result.body.message).toBe('Data disimpan')
  })

  it('should be email already exist', async () => {
    const result = await app.post('/api/v1/users').send({
      name: 'testuser3',
      email: 'testuser3@yopmail.com',
      password: await hashPassword('testuser3')
    }).set({
      Authorization: `Bearer ${mockToken}`
    })

    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email already exist')
  })

  it('should be bad request', async () => {
    const result = await app.post('/api/v1/users').send({
      email: null,
      name: null,
      password: await hashPassword('testuser3')
    }).set({
      Authorization: `Bearer ${mockToken}`
    })

    expect(result.status).toBe(400)
  })

  it('expect token not found', async () => {
    const result = await app.post('/api/v1/users').send({
      name: 'testuser3',
      email: 'testuser3@yopmail.com',
      password: await hashPassword('testuser3')
    })

    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email or password invalid')
  })

  it('should be invalid token', async () => {
    const result = await app.post('/api/v1/users').send({
      name: 'testuser3',
      email: 'testuser3@yopmail.com',
      password: await hashPassword('testuser3')
    }).set({
      Authorization: `Bearer ${mockToken}fail`
    })

    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email or password invalid')
  })
})

describe('[POST] login', () => {
  it('should successfully login', async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'testuser@yopmail.com',
      password: 'testuser'
    })
    expect(result.status).toBe(200)
    expect(result.body.message).toBe('Berhasil login')
  })

  it('should be invalid email', async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'testuser@failmail.com',
      password: 'testuser'
    })
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email or password invalid')
  })

  it('should be invalid password', async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'testuser@yopmail.com',
      password: 'testusersfail'
    })
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email or password invalid')
  })
})

describe('[POST] logout', () => {
  let mockToken: string
  beforeAll(async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'testuser@yopmail.com',
      password: 'testuser'
    })
    mockToken = result.body.data.token
  })
  it('should successfully logout', async () => {
    const result = await app.post('/api/v1/users/logout').set({
      Authorization: `Bearer ${mockToken}`
    })
    expect(result.status).toBe(200)
    expect(result.body.message).toBe('Berhasil logout')
  })

  it('should be invalid token', async () => {
    const result = await app.post('/api/v1/users/logout').set({
      Authorization: `Bearer ${mockToken}fail`
    })
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email or password invalid')
  })

  it('expect token not found', async () => {
    const result = await app.post('/api/v1/users/logout')
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Bearer token not found')
  })
})

describe('[POST] refreshToken', () => {
  let mockToken: string
  beforeAll(async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'testuser@yopmail.com',
      password: 'testuser'
    })
    mockToken = result.body.data.refresh_token
  })
  it('should successfully refresh token', async () => {
    const result = await app.post('/api/v1/users/refresh-token').send({
      refreshToken: mockToken
    })
    expect(result.status).toBe(200)
    expect(result.body.message).toBe('Berhasil memperbarui token')
  })

  it('should be invalid refresh token', async () => {
    const result = await app.post('/api/v1/users/refresh-token').send({
      refreshToken: 'invalid'
    })
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Refresh token invalid')
  })
})

describe('[GET] whoami', () => {
  let mockToken: string
  beforeAll(async () => {
    const result = await app.post('/api/v1/users/login').send({
      email: 'testuser@yopmail.com',
      password: 'testuser'
    })
    mockToken = result.body.data.token
  })

  it('should successfully whoami', async () => {
    const result = await app.get('/api/v1/users/me').set({
      Authorization: `Bearer ${mockToken}`
    })
    expect(result.status).toBe(200)
    expect(result.body.message).toBe('Berhasil mendapatkan data user')
  })

  it('should be invalid token', async () => {
    const result = await app.get('/api/v1/users/me').set({
      Authorization: `Bearer ${mockToken}fail`
    })
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Email or password invalid')
  })

  it('expect token not found', async () => {
    const result = await app.get('/api/v1/users/me')
    expect(result.status).toBe(401)
    expect(result.body.message).toBe('Bearer token not found')
  })
})
