
const Token = require('../../models/Token')
const Account = require('../../models/Account')

const createToken = require('../../utils/createToken')

function loginController() {
    return {
    // GET /users
      checkUserLogin: async (req, res, next) => {
          try {
                
              console.log('checkUserLogin controller')

              const text_input = req.body.text_input
              const password = req.body.password

              const account = await Account.findOne({
                  [res.locals.typeInput]: text_input,
                  password,
              })

              // console.log({
              //     [res.locals.typeInput]: text_input,
              //     password,
              // })

              console.log(account)

                if(!account) {
                    res.json({
                        type: 'warning',
                        message: `The ${res.locals.typeInput == 'email' ? 'email' : 'phone number'} or password is incorrect`
                    })
                } else {
                    if(account.disabled == true) {
                        res.json({
                            type: 'warning',
                            message: 'Your account is disabled!'
                        })
                    }
                }

              const newToken = await createToken({_id: account.toObject()._id})
              await Token.findOneAndUpdate({
                  _id: account.toObject()._id,
              }, {
                  $push: {
                      token: newToken.refreshToken,
                  }
              }, {
                  upsert: true,
              })
              res.cookie('accessToken', newToken.accessToken)
              res.cookie('refreshToken', newToken.refreshToken)
              res.json({
                  type: 'success',
                  message: 'Login successfully',
                  data: {
                      token: newToken,
                  }
              })

          }
          catch(err) {
            res.status(500).json({
                type: 'error',
                message: 'Login failed',
            })
          }
      }
  }
}

module.exports = loginController()