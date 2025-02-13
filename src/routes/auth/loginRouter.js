const router = require('express').Router()

const loginController = require('../../controllers/auth/loginController')

const loginMiddleware = require('../../middleware/auth/loginMiddleware')

router.post('/', loginMiddleware.isEmailOrPhoneNumber ,loginController.checkUserLogin)

module.exports = router