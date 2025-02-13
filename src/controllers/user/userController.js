const { default: mongoose } = require("mongoose")
const User = require("../../models/User")
const { toObjectLiteral } = require("../../utils/convertObjectLiteral")
const Account = require("../../models/Account")
const Playlist = require("../../models/Playlist")
const Song = require("../../models/Song")


function userController() {
    return {
        //GET user/me
        getUser: async (req, res, next) => {
            try {
                // console.log(res.locals._id)
                let user = await User.findOne({ _id: res.locals._id})
                user = toObjectLiteral(user)
                res.json({
                    type: 'success',
                    message: 'get user success',
                    data: {
                        user: user,
                    }
                })
            } catch(err) {
                console.log('userController/getUser', err)
                res.status(500).json({
                    type: 'error',
                    message: 'server error',
                })
            }
        },

        //PATCH user/update
        updateUser: async (req, res, next) => {
            const fieldOfAccount = ['phoneNumber', 'email', 'password']
            const fieldOfUser = ['fullname', 'username']
            let hasUser = false
            let hasAccount = false
            const optionUser = {}
            const optionAccount = {}

            for(let key in req.body) {
                if (fieldOfUser.includes(key)) {
                    if(req.body[key] != '') {
                        hasUser = true
                        optionUser[key] = req.body[key]
                    }
                } else {
                    if(req.body[key] != '') {
                        hasAccount = true
                        optionAccount[key] = req.body[key]
                    }
                }
            }

            console.log('user', optionUser)
            console.log('account', optionAccount)

            const session = await mongoose.startSession()
            
            let message
            try {
                await session.startTransaction()
                if(hasUser) {
                    await User.findByIdAndUpdate(res.locals._id, optionUser, {session})
                }
                if(hasAccount) {
                    await Account.findByIdAndUpdate(res.locals._id, optionAccount, {session})
                }
                message = {
                    status: 200,
                    type: 'success',
                    message: 'Update user success',
                }
                await session.commitTransaction()
            } catch(err) {
                console.log('userController/updateUser', err)
                await session.abortTransaction()
                message = {
                    status: 200,
                    type: 'error',
                    message: 'Update user error',
                }
            } finally {
                await session.endSession()
                res.status(message?.status).json(message)
            }
        },

        //PATCH user/upload
        updateAvatar: async (req, res, next) => {
            const uploadResult = req.file
            console.log(uploadResult)
            let message

            if(uploadResult != null) {
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

        //PATCH user/likeSong/:idSong
        likeSong: async (req, res, next) => {
            const idSong = req.params.idSong
            console.log(typeof idSong)
            let message 
            try {
                let user = await User.findOne({
                    _id: res.locals._id,
                })

                const liked = JSON.stringify(user.toObject().liked)

                if(liked.includes(idSong)) {
                    message = {
                        type: 'warning',
                        message: 'Exists song in liked list',
                    }
                } else {
                    await User.findOneAndUpdate({
                        _id: res.locals.id,
                    }, {
                        $push: {
                            liked: {
                                _id: idSong,
                                type: 'song',
                            }
                        }
                    })

                    await Song.findOneAndUpdate({
                        _id: idSong
                    }, {
                        $inc: {
                            likes: 1,
                        }
                    })
                    message = {
                        type: 'success',
                        message: 'Like success',
                    }
                }

            } catch(err) {
                console.log('userController/likeSong', err)
                message = {
                    type: 'error',
                    message: 'Like fail',
                }
            }
            res.json(message)
        },

        //PATCH user/likeSong/:idSong
        unlikeSong: async (req, res, next) => {
            const idSong = req.params.idSong
            console.log(idSong)
            let message 
            try {
                await User.findByIdAndUpdate({
                    _id: res.locals._id,
                    liked: {
                        $elemMatch: {
                            _id: idSong
                        }
                    }
                }, {
                    $pull: {
                        liked: {
                            _id: idSong,
                            type: 'song',
                        }
                    }
                })

                await Song.findOneAndUpdate({
                    _id: idSong
                }, {
                    $inc: {
                        likes: -1,
                    }
                })
                message = {
                    type: 'success',
                    message: 'Unlike success',
                }
            } catch(err) {
                console.log('userController/likeSong', err)
                message = {
                    type: 'error',
                    message: 'Unlike fail',
                }
            }
            res.json(message)
        },

        //PATCH user/createPlaylist
        createPlaylist: async(req, res, next) => {
            const { namePlaylist, public } = req.body
            try {
                await Playlist.create({
                    _idUser: res.locals._id,
                    name: namePlaylist,
                    public,
                    type: 'playlist',
                })

                res.json({
                    type: 'success',
                    message: 'Create playlist success',
                })
            } catch(err) {
                console.log('UserController/createPlaylist', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Create playlist error',
                })

            }
        },

        //PATCH user/deleteplaylist/:idPlaylist
        deletePlaylist: async(req, res, next) => {
            const { idPlaylist } = req.params
            try {
                await Playlist.findOneAndDelete({
                    _id: idPlaylist,
                    _idUser: res.locals._id,
                })

                res.json({
                    type: 'success',
                    message: 'Delete playlist success',
                })
            } catch(err) {
                console.log('UserController/createPlaylist', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Delete playlist error',
                })

            }
        },

        //PATCH user/addSongToPlaylist
        addSong: async(req, res, next) => {
            const { idSong, idPlaylist} = req.body
            console.log(req.body)
            console.log(idPlaylist)
            try {
                const pl = await Playlist.findOneAndUpdate({
                    _id: idPlaylist,
                    _idUser: res.locals._id,
                }, {
                    $push: {
                        list: idSong,
                    }
                })

                // console.log(pl)

                if(!pl) {
                    res.json({
                        type: 'warning',
                        message: 'Playlist dont exist',
                    })
                } else {
                    res.json({
                        type: 'success',
                        message: 'Add song to playlist success',
                    })
                }
            } catch(err) {
                console.log('Usercontroller/addSong', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Add song to playlist fail',
                })
            }
        },

        //PATCH user/deleteSongToPlaylist
        deleteSong: async(req, res, next) => {
            const { idSong, idPlaylist} = req.body
            console.log(req.body)
            console.log(idPlaylist)
            try {
                const pl = await Playlist.findOneAndUpdate({
                    _id: idPlaylist,
                    _idUser: res.locals._id,
                }, {
                    $pull: {
                        list: idSong,
                    }
                })

                // console.log(user)

                if(!pl) {
                    res.json({
                        type: 'warning',
                        message: 'Playlist dont exist',
                    })
                } else {
                    res.json({
                        type: 'success',
                        message: 'Delete song to playlist success',
                    })
                }
            } catch(err) {
                console.log('Usercontroller/deleteSong', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Delete song to playlist fail',
                })
            }
        }
    }
}

module.exports = userController()