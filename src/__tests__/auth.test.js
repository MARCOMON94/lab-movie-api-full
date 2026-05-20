const request = require('supertest')
const app = require('../../index')
const { crearUsuario } = require('./helpers')

describe('Auth', () => {
  it('debe registrar un usuario y devolver token', async () => {
    const email = `registro-${Date.now()}-${Math.floor(Math.random() * 100000)}@test.com`

    const res = await request(app)
      .post('/api/auth/registro')
      .send({
        nombre: 'Usuario Registro',
        email,
        password: 'admin123',
        rol: 'usuario'
      })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('usuario')
    expect(res.body.usuario.email).toBe(email)
  })

  it('debe hacer login y devolver token', async () => {
    const email = `login-${Date.now()}-${Math.floor(Math.random() * 100000)}@test.com`

    await crearUsuario({
      email,
      password: 'admin123',
      rol: 'usuario'
    })

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email,
        password: 'admin123'
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body).toHaveProperty('usuario')
    expect(res.body.usuario.email).toBe(email)
  })

  it('debe devolver 401 si el login tiene credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@test.com',
        password: 'mal'
      })

    expect(res.status).toBe(401)
  })

  it('debe devolver el perfil con token válido', async () => {
    const { token, usuario } = await crearUsuario()

    const res = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(usuario.id)
    expect(res.body.email).toBe(usuario.email)
  })

  it('debe devolver 401 al pedir perfil sin token', async () => {
    const res = await request(app)
      .get('/api/auth/perfil')

    expect(res.status).toBe(401)
  })
})
