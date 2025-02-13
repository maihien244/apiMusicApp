const mongoose = require('mongoose')
const { options } = require('../routes/admin')

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['register', 'forgot-password'],
    },
    
})

module.exports = mongoose.model('OTP', OTPSchema)