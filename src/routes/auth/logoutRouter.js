const router = require('express').Router()

const checkUserLogin = require('../../middleware/auth/checkUserLogin')

const logoutController = require('../../controllers/auth/logoutController')

router.post('/', checkUserLogin , logoutController.userLogout)

module.exports = router