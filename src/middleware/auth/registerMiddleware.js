const Account = require('../../models/Account')
const OTP = require('../../models/OTP')
const createToken = require('../../utils/createToken')

function RegisterMiddleware() {
    return {
        checkEmailOrPhoneExists: async (req, res, next) => {
            const { email, phoneNumber } = req.body
            // console.log('email', email)
            // console.log('phoneNumber', phoneNumber)
            if (!email && !phoneNumber) {
                res.json({
                    type: 'warning',
                    message: 'Email or Phonenumber is required',
                })
            } else {    
                const isExits = await Account.findOne({
                    $or: [ {email}, {phoneNumber} ]
                })
                // console.log('isExits', isExits)
                if (isExits) {
                    res.json({
                        type: 'warning',
                        message: 'Email or Phonenumber already exists',
                    })
                } else {
                    next()
                }
            }
        },

        checkOTP: async (req, res, next) => {
            const { email, otp} = req.body
            const otpData = await OTP.findOne({ email, otp, type: 'register' })
            // console.log('otpData', otpData)
            if (otpData) {
                next()
            } else {
                res.json({
                    type: 'warning',
                    message: 'Invalid OTP',
                })
            }
        }
    }
}

module.exports = RegisterMiddleware()