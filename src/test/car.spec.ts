import supertest from 'supertest'
import { afterAll, it, expect, describe, beforeAll } from 'vitest'
import { CarsModel } from '../databases/models/cars'
import server from '../server'
import fs from 'node:fs'
const app = supertest(server)

let mockToken = ''
let mockIdCar: number
beforeAll(async () => {
  const response = await app.post('/api/v1/users/login').send({
    email: 'superadmincar@yopmail.com',
    password: 'superadmincar'
  })
  console.log('Login response:', response.body.data.token)
  mockToken = response.body.data.token
})

afterAll(async () => {
  await CarsModel.query().delete().where('plate', 'DBH-3491')
})

describe('car', () => {
  describe('create cars', () => {
    it('should successfully create car', async () => {
      const dataImage = fs.readFileSync('./src/test/image-test.png')
      const result = await app.post('/api/v1/cars').set({
        Authorization: `Bearer ${mockToken}`
      }).field('plate', 'DBH-3491').field('manufacture', 'Ford').field('model', 'F150').field('rent_per_day', 200000).field('capacity', 2).field('description', 'Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.').field('available_at', '2023-10-25T23:49:05.563Z').field('transmission', 'manual').field('available', true).field('type', 'Sedan').field('year', 2022).field('options', JSON.stringify([
        'Cruise Control',
        'Tinted Glass',
        'Tinted Glass',
        'Tinted Glass',
        'AM/FM Stereo'
      ])).field('specs', JSON.stringify([
        'Brake assist',
        'Leather-wrapped shift knob',
        'Glove box lamp',
        'Air conditioning w/in-cabin microfilter',
        'Body color folding remote-controlled pwr mirrors',
        'Dual-stage front airbags w/occupant classification system'
      ])).attach('image', dataImage, 'image-test.jpg')
      mockIdCar = result.body.data.id
      expect(result.status).toBe(201)
      expect(result.body.message).toBe('Data disimpan')
    }, 100000)

    it('should be bad request', async () => {
      const dataImage = fs.readFileSync('./src/test/image-test.png')
      const result = await app.post('/api/v1/cars').set({
        Authorization: `Bearer ${mockToken}`
      }).field('plate', 'DBH-3491').field('manufacture', 'Ford').field('model', 'F150').field('rent_per_day', 200000).field('capacity', 2).field('description', 'Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.').field('available_at', '2023-10-25T23:49:05.563Z').field('transmission', 'smanual').field('available', true).field('type', 'Sedan').field('year', 2022).field('options', JSON.stringify([
        'Cruise Control',
        'Tinted Glass',
        'Tinted Glass',
        'Tinted Glass',
        'AM/FM Stereo'
      ])).field('specs', JSON.stringify([
        'Brake assist',
        'Leather-wrapped shift knob',
        'Glove box lamp',
        'Air conditioning w/in-cabin microfilter',
        'Body color folding remote-controlled pwr mirrors',
        'Dual-stage front airbags w/occupant classification system'
      ])).attach('image', dataImage, 'image-test.jpg')
      expect(result.status).toBe(400)
    }, 100000)

    it('should error not send image create car', async () => {
      const result = await app.post('/api/v1/cars').set({
        Authorization: `Bearer ${mockToken}`
      }).field('plate', 'DBH-3491').field('manufacture', 'Ford').field('model', 'F150').field('rent_per_day', 200000).field('capacity', 2).field('description', 'Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.').field('available_at', '2023-10-25T23:49:05.563Z').field('transmission', 'manual').field('available', true).field('type', 'Sedan').field('year', 2022).field('options', JSON.stringify([
        'Cruise Control',
        'Tinted Glass',
        'Tinted Glass',
        'Tinted Glass',
        'AM/FM Stereo'
      ])).field('specs', JSON.stringify([
        'Brake assist',
        'Leather-wrapped shift knob',
        'Glove box lamp',
        'Air conditioning w/in-cabin microfilter',
        'Body color folding remote-controlled pwr mirrors',
        'Dual-stage front airbags w/occupant classification system'
      ]))
      expect(result.status).toBe(400)
    }, 100000)

    it('expect token not found', async () => {
      const result = await app.post('/api/v1/cars')
      expect(result.status).toBe(401)
      expect(result.body.message).toBe('Email or password invalid')
    })
  })

  describe('list cars public', () => {
    it('should be return cars public', async () => {
      const result = await app.get('/api/v1/cars/public?limit=8&page=1&search=&sort=id&order=asc&dateFilter=&capacityFilter=')
      expect(result.body.message).toBe('Data ditemukan')
      expect(result.status).toBe(200)
    })

    it('should be return filter cars public', async () => {
      const result = await app.get('/api/v1/cars/public?limit=8&page=1&search=&sort=id&order=asc&dateFilter=2023-10-25&capacityFilter=2')
      expect(result.body.message).toBe('Data ditemukan')
      expect(result.status).toBe(200)
    })

    it('should be return filter date cars public', async () => {
      const result = await app.get('/api/v1/cars/public?limit=8&page=1&search=&sort=id&order=asc&dateFilter=&capacityFilter=2')
      expect(result.body.message).toBe('Data ditemukan')
      expect(result.status).toBe(200)
    })

    it('should not found if list cars public is empty', async () => {
      const result = await app.get('/api/v1/cars/public')
      expect(result.status).toBe(404)
      expect(result.body.message).toBe('NotFoundError')
    })
  })

  describe('list cars', () => {
    it('should be return cars', async () => {
      const result = await app.get('/api/v1/cars?limit=8&page=1&search=&sort=id&order=asc&dateFilter=&capacityFilter=').set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.body.message).toBe('Data ditemukan')
      expect(result.status).toBe(200)
    })

    it('should be return filter cars', async () => {
      const result = await app.get('/api/v1/cars?limit=8&page=1&search=&sort=id&order=asc&dateFilter=2023-10-25&capacityFilter=2').set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.body.message).toBe('Data ditemukan')
      expect(result.status).toBe(200)
    })

    it('should not found if list cars is empty', async () => {
      const result = await app.get('/api/v1/cars').set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(404)
    })
  })

  describe('get one cars', () => {
    it('should succes get one car', async () => {
      const result = await app.get(`/api/v1/cars/${mockIdCar}`).set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(200)
      expect(result.body.message).toBe('Data ditemukan')
    })

    it('should be error not send parameter', async () => {
      const result = await app.get(`/api/v1/cars/${null}`).set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(400)
    })

    it('should not found if car not found', async () => {
      const result = await app.get('/api/v1/cars/9999').set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(404)
      expect(result.body.message).toBe('NotFoundError')
    })

    it('should be token not found', async () => {
      const result = await app.get(`/api/v1/cars/${mockIdCar}`)
      expect(result.status).toBe(401)
      expect(result.body.message).toBe('Email or password invalid')
    })
  })

  describe('update cars', () => {
    it('should be success update', async () => {
      const dataImage = fs.readFileSync('./src/test/image-test.png')
      const result = await app.patch(`/api/v1/cars/${mockIdCar}`).set({
        Authorization: `Bearer ${mockToken}`
      }).field('plate', 'DBH-3491').field('manufacture', 'Ford').field('model', 'F150').field('rent_per_day', 200000).field('capacity', 2).field('description', 'Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.').field('available_at', '2023-10-25T23:49:05.563Z').field('transmission', 'manual').field('available', true).field('type', 'Sedan').field('year', 2022).field('options', JSON.stringify([
        'Cruise Control',
        'Tinted Glass',
        'Tinted Glass',
        'Tinted Glass',
        'AM/FM Stereo'
      ])).field('specs', JSON.stringify([
        'Brake assist',
        'Leather-wrapped shift knob',
        'Glove box lamp',
        'Air conditioning w/in-cabin microfilter',
        'Body color folding remote-controlled pwr mirrors',
        'Dual-stage front airbags w/occupant classification system'
      ])).attach('image', dataImage, 'image-test.jpg')

      expect(result.status).toBe(200)
      expect(result.body.message).toBe('Data diubah')
    }, 100000)

    it('should be error not send image update', async () => {
      const result = await app.patch(`/api/v1/cars/${mockIdCar}`).set({
        Authorization: `Bearer ${mockToken}`
      }).field('plate', 'DBH-3491').field('manufacture', 'Ford').field('model', 'F150').field('rent_per_day', 200000).field('capacity', 2).field('description', 'Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.').field('available_at', '2023-10-25T23:49:05.563Z').field('transmission', 'manual').field('available', true).field('type', 'Sedan').field('year', 2022).field('options', JSON.stringify([
        'Cruise Control',
        'Tinted Glass',
        'Tinted Glass',
        'Tinted Glass',
        'AM/FM Stereo'
      ])).field('specs', JSON.stringify([
        'Brake assist',
        'Leather-wrapped shift knob',
        'Glove box lamp',
        'Air conditioning w/in-cabin microfilter',
        'Body color folding remote-controlled pwr mirrors',
        'Dual-stage front airbags w/occupant classification system'
      ]))

      expect(result.status).toBe(400)
    }, 100000)

    it('should be error not send parameter', async () => {
      const result = await app.patch(`/api/v1/cars/${null}`).set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(400)
    })

    it('should be bad request', async () => {
      const dataImage = fs.readFileSync('./src/test/image-test.png')
      const result = await app.patch(`/api/v1/cars/${mockIdCar}`).set({
        Authorization: `Bearer ${mockToken}`
      }).field('plate', 'DBH-3491').field('manufacture', 'Ford').field('model', 'F150').field('rent_per_day', 200000).field('capacity', 2).field('description', 'Brake assist. Leather-wrapped shift knob. Glove box lamp. Air conditioning w/in-cabin microfilter.').field('available_at', '2023-10-25T23:49:05.563Z').field('transmission', 'manual').field('available', true).field('type', 'Sedan').field('year', 'a2022').field('options', JSON.stringify([
        'Cruise Control',
        'Tinted Glass',
        'Tinted Glass',
        'Tinted Glass',
        'AM/FM Stereo'
      ])).field('specs', JSON.stringify([
        'Brake assist',
        'Leather-wrapped shift knob',
        'Glove box lamp',
        'Air conditioning w/in-cabin microfilter',
        'Body color folding remote-controlled pwr mirrors',
        'Dual-stage front airbags w/occupant classification system'
      ])).attach('image', dataImage, 'image-test.jpg')

      expect(result.status).toBe(400)
    }, 100000)

    it('should be not found', async () => {
      const result = await app.patch('/api/v1/cars/999').set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(404)
      expect(result.body.message).toBe('NotFoundError')
    })

    it('expect token not found', async () => {
      const result = await app.patch(`/api/v1/cars/${mockIdCar}`)
      expect(result.status).toBe(401)
      expect(result.body.message).toBe('Email or password invalid')
    })
  })

  describe('delete car', () => {
    it('should be deleted', async () => {
      const result = await app.delete(`/api/v1/cars/${mockIdCar}`).set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(200)
      expect(result.body.message).toBe('Data dihapus')
    }, 100000)

    it('should be not found', async () => {
      const result = await app.delete('/api/v1/cars/999').set({
        Authorization: `Bearer ${mockToken}`
      })
      expect(result.status).toBe(404)
      expect(result.body.message).toBe('NotFoundError')
    })

    it('expect token not found', async () => {
      const result = await app.delete(`/api/v1/cars/${mockIdCar}`)
      expect(result.status).toBe(401)
      expect(result.body.message).toBe('Email or password invalid')
    })
  })
})
