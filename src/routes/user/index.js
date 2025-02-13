const express = require('express')
const router = express.Router()

const checkUserLogin = require('../../middleware/auth/checkUserLogin')

const userRouter = require('./userRouter')

router.use(checkUserLogin)
router.use('/', userRouter)

module.exports = router