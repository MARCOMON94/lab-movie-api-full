const request = require('supertest')
const app = require('../../index')
const { crearUsuario, crearPelicula } = require('./helpers')

const sufijo = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`

describe('Favoritos', () => {
  describe('POST /api/favoritos/:peliculaId', () => {
    it('debe añadir una película a favoritos (201)', async () => {
      const { token } = await crearUsuario()
      const pelicula = await crearPelicula()

      const res = await request(app)
        .post(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('ok', true)
      expect(res.body.favorito).toHaveProperty('peliculaId', pelicula.id)
    })

    it('debe devolver 401 sin token', async () => {
      const pelicula = await crearPelicula()

      const res = await request(app)
        .post(`/api/favoritos/${pelicula.id}`)

      expect(res.status).toBe(401)
    })

    it('debe devolver 404 si la película no existe', async () => {
      const { token } = await crearUsuario()

      const res = await request(app)
        .post('/api/favoritos/999999')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(404)
    })

    it('debe devolver 409 si la película ya está en favoritos', async () => {
      const { token } = await crearUsuario()
      const pelicula = await crearPelicula()

      await request(app)
        .post(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token}`)

      const res = await request(app)
        .post(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(409)
    })
  })

  describe('DELETE /api/favoritos/:peliculaId', () => {
    it('debe eliminar una película de favoritos (200)', async () => {
      const { token } = await crearUsuario()
      const pelicula = await crearPelicula()

      await request(app)
        .post(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token}`)

      const res = await request(app)
        .delete(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('ok', true)
    })

    it('debe devolver 404 si el favorito no existe', async () => {
      const { token } = await crearUsuario()
      const pelicula = await crearPelicula()

      const res = await request(app)
        .delete(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(404)
    })
  })

  describe('GET /api/favoritos', () => {
    it('debe devolver los favoritos del usuario autenticado', async () => {
      const { token } = await crearUsuario()
      const pelicula1 = await crearPelicula({ titulo: `Peli 1 ${sufijo()}` })
      const pelicula2 = await crearPelicula({ titulo: `Peli 2 ${sufijo()}` })

      await request(app)
        .post(`/api/favoritos/${pelicula1.id}`)
        .set('Authorization', `Bearer ${token}`)

      await request(app)
        .post(`/api/favoritos/${pelicula2.id}`)
        .set('Authorization', `Bearer ${token}`)

      const res = await request(app)
        .get('/api/favoritos')
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(2)
      expect(res.body[0]).toHaveProperty('titulo')
    })

    it('los favoritos de un usuario no incluyen los de otro', async () => {
      const id = sufijo()

      const { token: token1 } = await crearUsuario({
        email: `user1-${id}@test.com`
      })

      const { token: token2 } = await crearUsuario({
        email: `user2-${id}@test.com`
      })

      const pelicula = await crearPelicula({
        titulo: `Pelicula compartida ${id}`
      })

      await request(app)
        .post(`/api/favoritos/${pelicula.id}`)
        .set('Authorization', `Bearer ${token1}`)

      const res = await request(app)
        .get('/api/favoritos')
        .set('Authorization', `Bearer ${token2}`)

      expect(res.status).toBe(200)
      expect(res.body).toHaveLength(0)
    })
  })
})