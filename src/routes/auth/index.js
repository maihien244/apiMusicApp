const express = require('express')
const router = express.Router()

const loginRouter = require('./loginRouter')
const logoutRouter = require('./logoutRouter')
const registerRouter = require('./registerRouter')

router.use('/login', loginRouter)
router.use('/logout', logoutRouter)
router.use('/register', registerRouter)

module.exports = router