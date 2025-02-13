
const Token = require('../../models/Token')
const Account = require('../../models/Account')

const createToken = require('../../utils/createToken')

function logoutController() {
    return {
    // GET /auth/logout
    userLogout: async (req, res, next) => {
        const _id = res.locals._id
        console.log(_id)
        try {
            await Token.findByIdAndUpdate({
                _id,
            }, {
                $pull: {
                    token: req.cookies.refreshToken
                }
            })
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.json({
                type: 'success',
                message: 'User logout success'
            })
        } catch(err) {
            console.log('logout controller', err)
            res.status(500).json({
                type: 'error',
                message: 'User logout fail'
            })
        }     
    }
  }
}

module.exports = logoutController()