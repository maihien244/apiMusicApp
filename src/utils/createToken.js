require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = async (payload) => {
    const accessToken = await jwt.sign({
        _id: payload._id,
    }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m',
    })
    const refreshToken = await jwt.sign({
        _id: payload._id,
    }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: payload?.exp ? payload.exp : '1d',
    })
    return { accessToken, refreshToken }
}