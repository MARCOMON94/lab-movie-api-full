const { Router } = require('express')
const router = Router()
const { recomendar } = require('../controllers/iaController')

// Endpoint público — sin autenticación para que una IA externa pueda consultarlo
router.post('/recomendar', recomendar)

module.exports = router