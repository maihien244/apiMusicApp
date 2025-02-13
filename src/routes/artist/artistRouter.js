const router = require('express').Router()

const artistController = require('../../controllers/artist/artistController')
const uploadAvatar = require('../../middleware/cloudinaryUploadAvatar')

const uploadSong = require('multer')()


//
// router.patch('/deleteAlbum/:idAlbum')
router.put('/deleteAlbum/:idAlbum', artistController.deleteAlbum)
router.patch('/showAlbum/:idAlbum', artistController.showAlbum)
router.patch('/hiddenAlbum/:idAlbum', artistController.hiddenAlbum)
router.put('/createAlbum', artistController.createAlbum)
router.put('/deleteSong/:idSong', artistController.deleteSong)
router.patch('/showSong/:idSong', artistController.showSong)
router.patch('/hiddenSong/:idSong', artistController.hiddenSong)
router.put('/uploadSong', uploadSong.fields([
    { name: 'audio', maxCount: 1},
    { name: 'thumnail', maxCount: 1},
]), artistController.uploadSong)
router.patch('/changeAvatar',  uploadAvatar.single('avatar'), artistController.uploadAvatar)
router.patch('/update', artistController.updateArtist)
router.get('/me', artistController.getArtist)

module.exports = router