const request = require('supertest')
const app = require('../../index')
const { crearUsuario, crearPelicula, crearGenero } = require('./helpers')

describe('Películas', () => {
  it('GET /api/peliculas debe devolver paginación', async () => {
    await crearPelicula({ titulo: 'Pelicula Listado Test', nota: 8.2 })

    const res = await request(app)
      .get('/api/peliculas?limit=10&page=1')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('pagina')
    expect(res.body).toHaveProperty('totalPaginas')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('GET /api/peliculas/:id debe devolver una película con reseñas y conteo', async () => {
    const pelicula = await crearPelicula({ titulo: 'Pelicula Detalle Test' })

    const res = await request(app)
      .get(`/api/peliculas/${pelicula.id}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(pelicula.id)
    expect(res.body).toHaveProperty('resenas')
    expect(res.body).toHaveProperty('_count')
  })

  it('POST /api/peliculas debe crear una película con usuario autenticado', async () => {
    const { token } = await crearUsuario({ rol: 'usuario' })
    const genero = await crearGenero()

    const res = await request(app)
      .post('/api/peliculas')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: `Pelicula Creada ${Date.now()}`,
        anio: 2026,
        nota: 8.4,
        director: `Director Creado ${Date.now()}`,
        genero: genero.slug
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.titulo).toContain('Pelicula Creada')
  })

  it('POST /api/peliculas debe devolver 401 sin token', async () => {
    const res = await request(app)
      .post('/api/peliculas')
      .send({
        titulo: 'Pelicula Sin Token',
        anio: 2026
      })

    expect(res.status).toBe(401)
  })

  it('PUT /api/peliculas/:id debe devolver 403 con usuario no admin', async () => {
    const { token } = await crearUsuario({ rol: 'usuario' })
    const pelicula = await crearPelicula()

    const res = await request(app)
      .put(`/api/peliculas/${pelicula.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Intento no admin'
      })

    expect(res.status).toBe(403)
  })

  it('PUT /api/peliculas/:id debe actualizar con admin', async () => {
    const { token } = await crearUsuario({ rol: 'admin' })
    const pelicula = await crearPelicula()

    const res = await request(app)
      .put(`/api/peliculas/${pelicula.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Pelicula Actualizada Admin'
      })

    expect(res.status).toBe(200)
    expect(res.body.titulo).toBe('Pelicula Actualizada Admin')
  })
})