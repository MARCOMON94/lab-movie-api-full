const prisma = require('../config/prisma')

// GET /api/estadisticas/directores
const estadisticasDirectores = async (req, res, next) => {
  try {
    const directores = await prisma.director.findMany({
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            peliculas: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    })

    const respuesta = directores.map((director) => ({
      id: director.id,
      nombre: director.nombre,
      total_peliculas: director._count.peliculas
    }))

    res.json(respuesta)
  } catch (err) {
    next(err)
  }
}

// GET /api/estadisticas/generos
const estadisticasGeneros = async (req, res, next) => {
  try {
    const generos = await prisma.genero.findMany({
      select: {
        id: true,
        nombre: true,
        slug: true,
        _count: {
          select: {
            peliculas: true
          }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    })

    const respuesta = generos.map((genero) => ({
      id: genero.id,
      nombre: genero.nombre,
      slug: genero.slug,
      total_peliculas: genero._count.peliculas
    }))

    res.json(respuesta)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  estadisticasDirectores,
  estadisticasGeneros
}