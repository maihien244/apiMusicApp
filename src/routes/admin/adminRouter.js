const router = require('express').Router()

const adminController = require('../../controllers/admin/adminController')

// router.patch('deleteAlbum')
// router.patch('deleteSong')
router.patch('/restoreAccount/:id', adminController.restoreAccount) //-> khôi phục truy cập cho người dùng
router.patch('/disableAccount/:id', adminController.disableAccount)
// router.patch('/manageArtist') -> quản lí nghệ sĩ
// router.patch('/manageUser') -> quản lí người dùng
router.get('/getArtist', adminController.getArtist)
router.get('/getUser', adminController.getUser)
router.patch('/acceptPending/:idSong', adminController.acceptPending)
router.get('/getPending', adminController.getPending)
// router.get('/dashboard', adminController.dashboard) -> configAdmin đếm lượt nghe, lượt tải, lượt duyệt bài hát

module.exports = router