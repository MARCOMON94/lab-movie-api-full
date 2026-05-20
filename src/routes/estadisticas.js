const { Router } = require('express')

const {
  estadisticasDirectores,
  estadisticasGeneros
} = require('../controllers/estadisticasController')

const router = Router()

router.get('/directores', estadisticasDirectores)
router.get('/generos', estadisticasGeneros)

module.exports = router