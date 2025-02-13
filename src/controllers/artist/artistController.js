const mongoose = require('mongoose')

const uploadBuffer = require('../../utils/upload')
const removeSongInCloud = require('../../utils/destroy')

const uploadCloud = require("../../middleware/cloudinaryUploadAvatar")
const Artist = require("../../models/Artist")
const Account = require('../../models/Account')
const Song = require('../../models/Song')

const cloudinary = require('../../config/cloudinary')
const streamifier = require('streamifier')
const Album = require('../../models/Album')

function ArtistController() {
    return {
        //GET /artist/me
        getArtist: async (req, res, next) => {
            try {
                const artistId = res.locals._id
                const artist = await Artist.findById(artistId)
                res.json({
                    type: 'success',
                    message: 'Get artist success',
                    data: {
                        artist,
                    }
                })
            } catch(err) {
                console.log('artistController/getArtist', err)
                res.status(500).json({
                    type: 'Error',
                    message: 'Get artist error. Please try again.',
                    data: {
                        
                    }
                })
            }
        },

        //PATCH /artist/update
        updateArtist: async(req, res, next) => {
            const fieldOfAccount = ['phoneNumber', 'email', 'password']
            let hasArtist = false
            let hasAccount = false
            const optionArtist = {}
            const optionAccount = {}
            for(let key in req.body) {
                if (fieldOfAccount.includes(key)) {
                    if(req.body[key] != '') {
                        hasAccount = true
                        optionAccount[key] = req.body[key]
                    }
                } else {
                    if(req.body[key] != '') {
                        hasArtist = true
                        optionArtist[key] = req.body[key]
                    }
                }
            }

            console.log('user', optionArtist)
            console.log('account', optionAccount)

            const session = await mongoose.startSession()
            
            let message
            try {
                await session.startTransaction()
                if(hasArtist) {
                    await Artist.findByIdAndUpdate(res.locals._id, optionArtist, {session})
                }
                if(hasAccount) {
                    await Account.findByIdAndUpdate(res.locals._id, optionAccount, {session})
                }
                message = {
                    status: 200,
                    type: 'success',
                    message: 'Update artist information success',
                }
                await session.commitTransaction()
            } catch(err) {
                console.log('artistController/updateArtist', err)
                await session.abortTransaction()
                message = {
                    status: 200,
                    type: 'error',
                    message: 'Update artist information error',
                }
            } finally {
                await session.endSession()
                res.status(message?.status).json(message)
            }
        },

        //PATCH artist/changeAvatar
        uploadAvatar: async (req, res, next) => {
            const uploadResult = req.file
            let message

            if(uploadResult != null) {
                console.log(uploadResult)
                await Account.updateOne({
                    _id: res.locals._id,
                }, {
                    avatar: uploadResult.path
                })
                message = {
                    type: 'success',
                    message: 'Upload success',
                    path: uploadResult.path
                }
            } else {
                message = {
                    type: 'error',
                    message: 'Upload fail',
                }
            }
            res.json(message)
        },

        //PUT artist/uploadSong
        uploadSong: async(req, res, next) => {
            const session = await mongoose.startSession()
            let message

            try {

                await session.startTransaction()
                if (!req.files) {
                  return res.status(400).json({ error: "No file uploaded" });
                }
                // console.log(req.files)
                // console.log(uploadBuffer)
                const result = await uploadBuffer(req.files.thumnail[0].buffer, req.files.audio[0].buffer)
                // console.log(result)
                const song = await Song.create([{
                    title: req.body.title,
                    artistId: res.locals._id,
                    albumId: req.body.albumId,
                    genre: req.body.genre,
                    duration: req.body.duration,
                    audioUrl: result.audio,
                    thumnailUrl: result.image,
                    public: req.body.public,
                    public_id: {
                        audio_id: result.audio_id,
                        image_id: result.image_id,
                    }
                }], { session})
                await Album.findOneAndUpdate({
                    _id: req.body.albumId,
                    artistId: res.locals._id,
                }, {
                    $push: {
                        list: song[0].toObject()._id.toString(),
                    }
                }, {session})
                message = {
                    status: 200,
                    type: 'success',
                    message: 'Create song sucesss',
                }
                await session.commitTransaction()
              } catch (error) {
                console.error("Error:", error);
                await session.abortTransaction()
                message = {
                    status: 500, 
                    type: 'error',
                    message: "Create song error",
                }
              } finally {
                    await session.endSession()
                    res.status(message.status).json(message)
              }
        },

        //PATCH artist/hiddenSong/:idSong
        hiddenSong: async(req, res, next) => {
            try {
                const song = await Song.findOneAndUpdate({
                    _id: req.params.idSong,
                    artistId: res.locals._id,
                }, {
                    $set: {
                        public: false,
                    }
                })
                
                if(song) {
                    res.json({
                        type: 'success',
                        message: 'Hidden song success',
                    })
                } else {
                    res.json({
                        type: 'warning',
                        message: 'Has error. Please try agian!'
                    })
                }
            } catch(err) {
                console.log('ArtistController/hiddenSong', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Server error',
                })
            }
        },

        //PATCH artist/showSong/:idSong
        showSong: async(req, res, next) => {
            try {
                const song = await Song.findOneAndUpdate({
                    _id: req.params.idSong,
                    artistId: res.locals._id,
                }, {
                    $set: {
                        public: true,
                    }
                })
                
                if(song) {
                    res.json({
                        type: 'success',
                        message: 'Show song success',
                    })
                } else {
                    res.json({
                        type: 'warning',
                        message: 'Has error. Please try agian!'
                    })
                }
            } catch(err) {
                console.log('ArtistController/hiddenSong', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Server error',
                })
            }
        },

        //PUT artist/deleteSong/:idSong
        deleteSong: async(req, res, next) => {
            const session = await mongoose.startSession()
            let message

            try {
                await session.startTransaction()
                const song = await Song.findOneAndDelete({
                    _id: req.params.idSong,
                    artistId: res.locals._id,
                }, {session})
                
                await removeSongInCloud(song.toObject().public_id.audio_id, song.toObject().public_id.image_id)
                await Album.findByIdAndUpdate({
                    _id: song.toObject().albumId,
                    artistId: res.locals._id,
                }, {
                    $pull: {
                        list: req.params.idSong
                    }
                }, {session})

                message = {
                    status: 200,
                    type: 'success',
                    message: 'Delete song success',
                }
                await session.commitTransaction()
            } catch(err) {
                console.log('ArtistController/hiddenSong', err)
                await session.abortTransaction()
                message = {
                    status: 500,
                    type: 'error',
                    message: 'Server error',
                }
            } finally {
                await session.endSession()

                res.status(message.status).json(message)
            }
        },

        //PUT artist/createAlbum
        createAlbum:  async(req, res, next) => {
            try {
                await Album.create({
                    artistId: res.locals._id,
                    name: req.body.albumName,
                    public: !!req.body?.public,
                })
                res.json({
                    type: 'success',
                    message: 'Create album success',
                })
            } catch(err) {
                console.log('ArtistController/createAlbum', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Create album error',
                })
            }
        },

        //PATCH artist/hiddenAlbum
        hiddenAlbum: async(req, res, next) => {
            const session = await mongoose.startSession()
            let message

            try {
                await session.startTransaction()
                const album = await Album.findOneAndUpdate({
                    _id: req.params.idAlbum,
                    artistId: res.locals._id,
                }, {
                    $set: {
                        public: false,
                    }
                }, {session})
                
                if(album) {
                    await Song.updateMany({
                        albumId: req.params.idAlbum
                    }, {
                        $set: { public: false}
                    }, {session})
    
                    message = {
                        status: 200,
                        type: 'success',
                        message: 'Hidden album success',
                    }
                } else {
                    message = {
                        status: 201,
                        type: 'warning',
                        message: 'The album dont exists',
                    }
                }
                await session.commitTransaction()
            } catch(err) {
                console.log('ArtistController/hiddenAlbum', err)
                await session.abortTransaction()
                message = {
                    status: 500,
                    type: 'error',
                    message: 'Hidden album error',
                }
            } finally {
                await session.endSession()
                res.status(message.status).json(message)
            }
        },

        //PATCH artist/showAlbum
        showAlbum: async(req, res, next) => {
            const session = await mongoose.startSession()
            let message

            try {
                await session.startTransaction()
                const album = await Album.findOneAndUpdate({
                    _id: req.params.idAlbum,
                    artistId: res.locals._id,
                }, {
                    $set: {
                        public: true,
                    }
                }, {session})
                
                if(album) {
                    await Song.updateMany({
                        albumId: req.params.idAlbum
                    }, {
                        $set: { public: true}
                    }, {session})
    
                    message = {
                        status: 200,
                        type: 'success',
                        message: 'Show album success',
                    }
                } else {
                    message = {
                        status: 201,
                        type: 'warning',
                        message: 'The album dont exists',
                    }
                }
                await session.commitTransaction()
            } catch(err) {
                console.log('ArtistController/hiddenAlbum', err)
                await session.abortTransaction()
                message = {
                    status: 500,
                    type: 'error',
                    message: 'Show album error',
                }
            } finally {
                await session.endSession()
                res.status(message.status).json(message)
            }
        },

        //PUT artist/deleteAlbum/:idAlbum
        deleteAlbum: async(req, res, next) => {
            const session = await mongoose.startSession()
            let message

            try {
                await session.startTransaction()

                const album = await Album.deleteOne({
                    _id: req.params.idAlbum,
                    artistId: res.locals._id,
                }, {
                    session
                })

                if(album) {
                    await Song.updateMany({
                        albumId: req.params.idAlbum,
                        artistId: res.locals._id,
                    }, {
                        $set: { albumId: ''},
                    }, { session })

                    message = {
                        status: 200,
                        type: 'success',
                        message: 'Delete album success',
                    }
                } else {
                    message = {
                        status: 201,
                        type: 'warning',
                        message: 'The album dont exists',
                    }
                }
                await session.commitTransaction()
            } catch(err) {
                console.log('ArtistController/DeleteAlbum', err)
                await session.abortTransaction()
                message = {
                    status: 500,
                    type: 'error',
                    message: 'Delete album error',
                }
            } finally{
                res.status(message.status).json(message)
            }
        }
    }
}

module.exports = ArtistController()