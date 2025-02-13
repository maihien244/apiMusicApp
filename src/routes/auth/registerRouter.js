const router = require('express').Router()

const registerController = require('../../controllers/auth/registerController')
const registerMiddleware = require('../../middleware/auth/registerMiddleware')

router.post('/create-otp', registerMiddleware.checkEmailOrPhoneExists, registerController.sendOTP)
router.post('/submit-otp', registerMiddleware.checkOTP, registerController.submitOTP)

module.exports = router