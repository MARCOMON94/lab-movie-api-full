require('dotenv').config()

const express = require('express')

const peliculasRouter = require('./src/routes/peliculas')
const authRouter = require('./src/routes/auth')
const favoritosRouter = require('./src/routes/favoritos')
const estadisticasRouter = require('./src/routes/estadisticas')
const iaRouter = require('./src/routes/ia')

const errorHandler = require('./src/middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/peliculas', peliculasRouter)
app.use('/api/favoritos', favoritosRouter)
app.use('/api/estadisticas', estadisticasRouter)
app.use('/api/ia', iaRouter)

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de películas funcionando',
    rutas: [
      'POST /api/auth/registro',
      'POST /api/auth/login',
      'GET /api/auth/perfil',

      'GET /api/peliculas',
      'GET /api/peliculas/:id',
      'POST /api/peliculas',
      'PUT /api/peliculas/:id',
      'DELETE /api/peliculas/:id',

      'GET /api/peliculas/:id/resenas',
      'POST /api/peliculas/:id/resenas',

      'GET /api/favoritos',
      'POST /api/favoritos/:id',
      'DELETE /api/favoritos/:id',

      'GET /api/estadisticas/directores',
      'GET /api/estadisticas/generos',

      'POST /api/ia/recomendar'
    ]
  })
})

app.use((req, res) => {
  res.status(404).json({
    error: `Ruta ${req.method} ${req.url} no encontrada`
  })
})

app.use(errorHandler)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
  })
}

module.exports = app