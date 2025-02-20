const mongoose = require('mongoose')

const month =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const adminSchema = new mongoose.Schema({
    idYear: { type: String, default: (new Date()).getFullYear().toString()},
    idMonth: { type: String, default: month[(new Date()).getMonth()]},
    new_user: { type: Number, default: 0},
    new_artist: { type: Number, default: 0},
    violators: { type: Number, default: 0},
    new_song_post: { type: Number, default: 0},
    listens: { type: Number, default: 0},
    pending: { type: Number, default: 0},
})

module.exports = mongoose.model('Admin', adminSchema)
