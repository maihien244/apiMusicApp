const express = require('express')
const router = express.Router()

const adminRoutes = require('./admin')
const artistRoutes = require('./artist')
const userRoutes = require('./user')
const authRoutes = require('./auth')

function routes(app) {
    app.use('/admin', adminRoutes)
    app.use('/artist', artistRoutes)
    app.use('/auth', authRoutes)
    console.log(1)
    app.use('/user', userRoutes)
}

module.exports = routes