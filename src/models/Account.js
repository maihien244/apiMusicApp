const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'artist', 'user'],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Account', accountSchema)