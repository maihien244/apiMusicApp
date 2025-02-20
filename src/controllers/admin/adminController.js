const mongoose = require("mongoose")
const Song = require("../../models/Song")
const Admin = require("../../models/Admin")
const { toMultiObjectLiteral } = require("../../utils/convertObjectLiteral")
const User = require("../../models/User")
const Account = require("../../models/Account")
const { getArtist } = require("../artist/artistController")
const Artist = require("../../models/Artist")

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function AdminController() {
    return {
        //GET admin/getPending
        getPending: async (req, res, next) => {
            try {
                const page_size = 15
                const date = new Date()
                
                const length = (await Admin.findOne({
                    idYear: date.getFullYear().toString(),
                    idMonth: month[date.getMonth()],
                })).pending

                let pages = length/page_size
                pages = ( pages == parseInt(pages)) ? parseInt(pages) : parseInt(pages) + 1
                let page_number = (req.params?.pages < 0 || req.params.pages > pages) ? 1 : req.params?.pages 

                let songs = await Song.find({
                    pending: true,
                })

                songs = toMultiObjectLiteral(songs)

                res.json({
                    type: 'success',
                    message: 'Get song pending success',
                    data: {
                        songs,
                    }
                })
            } catch(err) {
                console.log('adminController/getPending', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Get song pending error',
                })
            }
        },

        //PATCH admin/acceptPending
        acceptPending: async (req, res, next) => {
            const session = await mongoose.startSession()
            let message = null

            try {
                
                await session.startTransaction()

                const song = await Song.findOneAndUpdate({
                    _id: req.params.idSong,
                    pending: true,
                }, {
                    $set: { pending: false }
                }, { session })

                console.log(song)

                if(!song) {
                    message = {
                        status: 201,
                        type: 'warning',
                        message: 'This song does not exists',
                    }
                    throw Error('This song does not exists')
                }

                const date = new Date()
                
                await Admin.findOneAndUpdate({
                    idYear: date.getFullYear().toString(),
                    idMonth: month[date.getMonth()]
                }, {
                    $inc: {
                        pending: -1,
                        new_song_post: 1,
                    },
                }, {
                    session,
                    upsert: true,
                })

                message = {
                    status: 200,
                    type: 'success',
                    message: 'Accept the song success'
                }

                await session.commitTransaction()
            } catch(err) {
                console.log('adminComtroller/acceptPending', err)
                await session.abortTransaction()
                message = (message == null) ? {
                    status: 500,
                    type: 'error',
                    message: 'Accept the song error'
                } : message
            } finally {
                await session.endSession()
                res.status(message.status).json(message)
            }
        },

        //GET admin/getUser
        getUser: async (req, res, next) => {
            try {
                const page_size = 15
                
                const users = toMultiObjectLiteral(await User.find({}))

                // console.log(users)

                let length = users.length
                let pages = length/page_size
                let current_page

                if(req.query?.pages) {
                    current_page = (req.query.pages < 0) ? 1 : req.query.pages
                } else {
                    current_page = 1
                }

                pages = ( pages == parseInt(pages)) ? parseInt(pages) : parseInt(pages) + 1
                let page_number = (current_page > pages) ? 1 : current_page 

                // console.log(page_number)

                const dts = []

                for(let i = (page_number-1)*page_size; i < page_number*page_size; ++i) {
                    if(users[i]) {
                        const acc = await Account.findById(users[i]?._id)
                        // console.log('acc', acc)
                        dts.push({
                            ...users[i],
                            email: acc?.email,
                            phoneNumber: acc?.phoneNumber,
                            avatar: acc?.avatar,
                        })
                    }
                }
                // console.log(dts)
                res.json({
                    type: 'success',
                    message: 'Get user success',
                    data: {
                        users: dts,
                    }
                })
            } catch(err) {
                console.log('adminController/getUser', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Get user error',
                })
            }
        },

        //GET admin/getArtist
        getArtist: async (req, res, next) => {
            try {
                const page_size = 15
                
                const artist = toMultiObjectLiteral(await Artist.find({}))

                // console.log(users)

                let length = artist.length
                let pages = length/page_size
                let current_page

                if(req.query?.pages) {
                    current_page = (req.query.pages < 0) ? 1 : req.query.pages
                } else {
                    current_page = 1
                }

                pages = ( pages == parseInt(pages)) ? parseInt(pages) : parseInt(pages) + 1
                let page_number = (current_page > pages) ? 1 : current_page 

                // console.log(page_number)

                const dts = []

                for(let i = (page_number-1)*page_size; i < page_number*page_size; ++i) {
                    if(artist[i]) {
                        const acc = await Account.findById(artist[i]?._id)
                        // console.log('acc', acc)
                        dts.push({
                            ...artist[i],
                            email: acc?.email,
                            phoneNumber: acc?.phoneNumber,
                            avatar: acc?.avatar,
                        })
                    }
                }
                // console.log(dts)
                res.json({
                    type: 'success',
                    message: 'Get artist success',
                    data: {
                        users: dts,
                    }
                })
            } catch(err) {
                console.log('adminController/getArtist', err)
                res.status(500).json({
                    type: 'error',
                    message: 'Get artist error',
                })
            }
        },

        //PATCH admin/disableAccount
        disableAccount: async(req, res, next) => {
            const id = req.params.id
            const session = await mongoose.startSession()
            let message = null

            try {
                await session.startTransaction()
                const acc = await Account.findOneAndUpdate({
                    _id: id,
                }, {
                    $set: { disabled: true},
                }, { session })

                if(!acc) {
                    message = {
                        status: 201,
                        type: 'warning',
                        message: 'The account does not exist',
                    }
                    throw new Error('The account does not exist')
                }

                const date = new Date()

                await Admin.findOneAndUpdate({
                    idYear: date.getFullYear().toString(),
                    idMonth: month[date.getMonth()],
                }, {
                    $inc: { violators: 1},
                }, {
                    session,
                    upsert: true,
                })

                message = {
                    status: 200,
                    type: 'success',
                    message: 'Disabled success',
                }

                await session.commitTransaction()
            } catch(err) {
                console.log('adminController/disableAccount', err)
                await session.abortTransaction()
                
                message = (message == null) ? {
                    status: 500,
                    type: 'error',
                    message: 'Server error',
                } : message
            } finally {
                await session.endSession()
                res.status(message.status).json(message)

            }
        },

        //PATCH admin/restoreAccount
        restoreAccount: async(req, res, next) => {
            const id = req.params.id
            const session = await mongoose.startSession()
            let message = null

            try {
                await session.startTransaction()
                const acc = await Account.findOneAndUpdate({
                    _id: id,
                }, {
                    $set: { disabled: false},
                }, { session })

                if(!acc) {
                    message = {
                        status: 201,
                        type: 'warning',
                        message: 'The account does not exist',
                    }
                    throw new Error('The account does not exist')
                }

                message = {
                    status: 200,
                    type: 'success',
                    message: 'Restore success',
                }

                await session.commitTransaction()
            } catch(err) {
                console.log('adminController/disableAccount', err)
                await session.abortTransaction()
                
                message = (message == null) ? {
                    status: 500,
                    type: 'error',
                    message: 'Server error',
                } : message
            } finally {
                await session.endSession()
                res.status(message.status).json(message)
                
            }
        }
    }
}

module.exports = AdminController()