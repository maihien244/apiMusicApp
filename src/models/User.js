const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: { type: String, require: true},
    fullname: { type: String, require: true},
    username: { type: String, require: true},
    playlist: [],
    liked: [],
}, {
    _id: false,
})

module.exports = mongoose.model('User', userSchema)