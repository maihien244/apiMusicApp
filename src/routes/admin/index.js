const express = require('express')
const router = express.Router()

const adminRouter = require('./adminRouter')

const checkRole = require('../../middleware/auth/checkRole')
const checkUserLogin = require('../../middleware/auth/checkUserLogin')


router.use(checkUserLogin)
router.use(checkRole.isAdmin)
router.use('/', adminRouter)

module.exports = router