import { describe, it, expect } from 'vitest'
import supertest from 'supertest'

import server from './server'

const app = supertest(server)

describe('success run server', () => {
  it('response status code should be 200', async () => {
    const response = await app.get('/')
    expect(response.status).toBe(200)
  })

  it('response status should be success', async () => {
    const response = await app.get('/')
    expect(response.body.status).toBe('success')
  })

  it('response message should be Welcome to Car Rental API', async () => {
    const response = await app.get('/')
    expect(response.body.message).toBe('Welcome to Car Rental API')
  })

  it('response data should be null', async () => {
    const response = await app.get('/')
    expect(response.body.data).toBeNull()
  })
})

describe('route not found', () => {
  it('response status code should be 404', async () => {
    const response = await app.get('/routeisnotfound')
    expect(response.status).toBe(404)
  })

  it('response status should be error', async () => {
    const response = await app.get('/routeisnotfound')
    expect(response.body.status).toBe('error')
  })

  it('response message should be Route not found', async () => {
    const response = await app.get('/routeisnotfound')
    expect(response.body.message).toBe('Route not found')
  })

  it('response data should be null', async () => {
    const response = await app.get('/routeisnotfound')
    expect(response.body.data).toBeNull()
  })
})
