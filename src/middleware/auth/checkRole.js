const Account = require("../../models/Account")

class CheckRoleUser{
    async isArtist(req, res, next) {
        const account = await Account.findById(res.locals._id)
        if(account?.role == 'artist') {
            next()
        } else {
            res.json({
                type: 'warning',
                message: 'You cant'
            })
        }
    }

    async isAdmin(req, res, next) {
        const account = await Account.findById(res.locals._id)
        if(account?.role == 'admin') {
            next()
        } else {
            res.json({
                type: 'warning',
                message: 'You cant'
            })
        }
    }
}


module.exports = new CheckRoleUser
