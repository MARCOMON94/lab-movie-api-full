const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

const generarSufijo = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`

const crearUsuario = async ({
  nombre = 'Usuario Test',
  email,
  password = 'admin123',
  rol = 'usuario'
} = {}) => {
  const sufijo = generarSufijo()
  const emailFinal = email || `usuario-${sufijo}@test.com`
  const passwordHash = await bcrypt.hash(password, 10)

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      email: emailFinal,
      passwordHash,
      rol
    }
  })

  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return {
    usuario,
    token,
    password
  }
}

const crearDirector = async ({
  nombre
} = {}) => {
  const sufijo = generarSufijo()

  return prisma.director.create({
    data: {
      nombre: nombre || `Director Test ${sufijo}`
    }
  })
}

const crearGenero = async ({
  nombre,
  slug
} = {}) => {
  const sufijo = generarSufijo()

  return prisma.genero.create({
    data: {
      nombre: nombre || `Genero Test ${sufijo}`,
      slug: slug || `genero-test-${sufijo}`
    }
  })
}

const crearPelicula = async ({
  titulo,
  anio = 2024,
  nota = 8.0,
  directorNombre,
  generoNombre,
  generoSlug
} = {}) => {
  const sufijo = generarSufijo()

  const director = await crearDirector({
    nombre: directorNombre || `Director Pelicula ${sufijo}`
  })

  const genero = await crearGenero({
    nombre: generoNombre || `Genero Pelicula ${sufijo}`,
    slug: generoSlug || `genero-pelicula-${sufijo}`
  })

  return prisma.pelicula.create({
    data: {
      titulo: titulo || `Pelicula Test ${sufijo}`,
      anio,
      nota,
      directorId: director.id,
      generoId: genero.id
    },
    include: {
      director: true,
      genero: true
    }
  })
}

module.exports = {
  crearUsuario,
  crearDirector,
  crearGenero,
  crearPelicula
}