const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    artistId: { type: String, require: true},
    name: { type: String, require: true},
    public: { type: Boolean, require: true},
    deleted: { type: Boolean, default: false},
    list: []
})

module.exports = mongoose.model('Album', albumSchema)