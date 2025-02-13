const mongoose = require('mongoose')

const playlistSchema = new mongoose.Schema({
    _idUser: { type: String, require: true},
    name: { type: String, require: true},
    public: { type: Boolean, require: true},
    type: { type: String, enum: ['playlist', 'album']},
    deleted: { type: Boolean, default: false},
    list: []
})

module.exports = mongoose.model('Playlist', playlistSchema)