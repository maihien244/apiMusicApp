const express = require('express')
const router = express.Router()

const artistRouter = require('./artistRouter')

const CheckRoleUser = require('../../middleware/auth/checkRole')
const checkUserLogin = require('../../middleware/auth/checkUserLogin')

router.use(checkUserLogin)
router.use(CheckRoleUser.isArtist)
router.use('/', artistRouter)

module.exports = router