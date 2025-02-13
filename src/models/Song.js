const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
    title: { type: String, require: true},
    artistId: { type: String, require: true},
    albumId: { type: String},
    genre: { type: String, require: true},
    duration: { type: Number, require: true},
    public: { type: Boolean, require: true},
    releaseDate: {type: Date, default: (new Date()).getTime()},
    audioUrl: { type: String, require: true},
    thumnailUrl: { type: String, require: true},
    likes: { type: String, default: 0},
    streams: { type: String, default: 0},
    deleted: { type: Boolean, default: false},
    pendind: { type: Boolean, default: true},
    
    public_id: {},
})

module.exports = mongoose.model('Song', songSchema)