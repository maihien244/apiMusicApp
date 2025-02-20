const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
require('dotenv').config()

const createOTP = require('../../utils/createOTP')
const createToken = require('../../utils/createToken')
const OTP = require('../../models/OTP')
const Account = require('../../models/Account')
const Token = require('../../models/Token')
const User = require('../../models/User')
const Artist = require('../../models/Artist')
const Admin = require('../../models/Admin')

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function registerController() {
  return {
    // POST auth/create-otp
    sendOTP: async (req, res, next) => {
        const { email } = req.body
        const otp = createOTP()
        console.log(process.env.EMAIL)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        })

        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for email verification',
            text: `Your OTP is ${otp}`,
        }

        await transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error)
                res.status(500).json({ message: 'OTP not sent' })
            } else {
                console.log('Email sent: ' + info.response)
                const newOTP = await OTP.create({
                    email,
                    otp,
                    type: 'register',
                })
                res.status(200).json({ 
                  message: 'OTP sent successfully'
                })
            }
        })
    },
    // POST auth/register/submit-otp
    submitOTP: async (req, res, next) => {
        // console.log('submitOTP')
        const session = await mongoose.startSession()
        let message 
        try {
            await session.startTransaction()
            console.log('req.body', req.body)
            await OTP.deleteOne({ email: req.body.email, type: 'register' }, { session})
            let account 
            if(req.body.role == 'admin') {
                res.status(400).json({
                    type: 'error',
                    message: 'Dont accept'
                })
            } else {
                await Account.create([req.body], { session: session})
                account = await Account.findOneAndUpdate({ email: req.body.email }, {}, {session: session})
            }

            const date = new Date()

            await Admin.findOneAndUpdate({
                idYear: date.getFullYear().toString(),
                idMonth: month[date.getMonth()]
            }, {
                $inc: {
                    new_user: (req.body.role == 'user') ? 1 : 0,
                    new_artist: (req.body.role == 'artist') ? 1 : 0,
                },
            }, {
                session,
                upsert: true,
            })

            if(req.body.role == 'user') {
                await User.create([{
                    _id: account.toObject()._id,
                    fullname: req.body.fullname,
                    username: req.body.username,
                }], {session: session})

            } else {
                await Artist.create([{
                    _id: account.toObject()._id,
                    fullname: req.body.fullname,
                    username: req.body.username,
                    bio: req.body?.bio
                }])
            }
            // console.log('account', account)
            const newToken = await createToken({_id: account.toObject()._id})
            // console.log(newToken)
            const tk = await Token.findOneAndUpdate({
                _id: account.toObject()._id,
            }, {
                $push: {
                    token: newToken.refreshToken,
                },
            }, { 
                session: session,
                upsert: true,
            })
            res.cookie('accessToken', newToken.accessToken)
            res.cookie('refreshToken', newToken.refreshToken)
            message = {
                type: 'success',
                message: 'Account created successfully',
                status: 200,
                token: newToken,
            }
            await session.commitTransaction()
        } catch(err) {
            console.log('register controller', err)
            await session.abortTransaction()
            message = {
                type: 'error',
                message: 'Account not created',
                status: 500,
            }
        } finally {
            session.endSession()
            res.status(message?.status).json(message)
        }
    }
  }
}

module.exports = registerController()