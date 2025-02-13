const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    token: [],
}, {
    _id: false,
})

module.exports = mongoose.model('Token', TokenSchema)