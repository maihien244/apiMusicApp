const router = require('express').Router()

const userController = require('../../controllers/user/userController')
const uploadcloud = require('../../middleware/cloudinaryUploadAvatar')

router.patch('/deleteSongToPlaylist', userController.deleteSong)
router.patch('/addSongToPlaylist', userController.addSong)
router.put('/deletePlaylist/:idPlaylist', userController.deletePlaylist)
router.put('/createPlaylist', userController.createPlaylist)
router.patch('/likeSong/:idSong', userController.likeSong)
router.patch('/unlikeSong/:idSong', userController.unlikeSong)
router.patch('/upload',uploadcloud.single('image'), userController.updateAvatar)
router.patch('/update', userController.updateUser)
router.get('/me', userController.getUser)

module.exports = router