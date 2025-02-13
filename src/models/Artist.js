const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({
    artistId: { type: String, require: true},
    fullname: { type: String, require: true},
    username: { type: String, require: true},
    bio: { type: String, default: ''},
    createAt: { type: Date, default: (new Date()).getTime()},
})

module.exports = mongoose.model('Artist', artistSchema)