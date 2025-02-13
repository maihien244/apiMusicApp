const jwt = require('jsonwebtoken')

const Account = require('../../models/Account')
const Token = require('../../models/Token')

const createToken = require('../../utils/createToken')

module.exports = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies
    // console.log(accessToken)
    // console.log(refreshToken)
    // console.log(accessToken, refreshToken)
    try {
        const decodedat = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        res.locals._id = decodedat._id
        next()
    } catch(err) {
        console.log('checkUserLogin in catch 1', err)
        try {
            const decodedrt = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            res.locals._id = decodedrt._id
            await Token.findOneAndUpdate({
                _id: decodedrt._id,
            }, {
                $pull: {
                    token: refreshToken,
                }
            })
            const newToken = await createToken({
                _id: decodedrt._id,
                exp: ((new Date()) < (new Date(decodedrt.exp))) ? decodedrt.exp : null,
            })
            res.cookie('accessToken', newToken.accessToken)
            res.cookie('refreshToken', newToken.refreshToken)
            res.locals.token = newToken
            next()
        } catch(err) {
            console.log('checkUserLogin in catch 2', err)
            res.json({
                type: 'warning',
                message: 'Dont login',
            })
        }
    }
}