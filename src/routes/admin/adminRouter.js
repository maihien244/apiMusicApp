const router = require('express').Router()

const adminController = require('../../controllers/admin/adminController')

// router.patch('deleteAlbum')
// router.patch('deleteSong')
// router.patch('restoreAccount') -> khôi phục truy cập cho người dùng
// router.patch('disableAccount') -> Vô hiệu hóa người dùng -> bao gồm user và artist
// router.patch('/manageArtist') -> quản lí nghệ sĩ
// router.patch('/manageUser') -> quản lí người dùng
// router.patch('/acceptPending') -> duyệt các bài hát mà artist mới đăng lên -> thông qua hoặc xóa đi
// router.get('/dashboard', adminController.dashboard) -> configAdmin đếm lượt nghe, lượt tải, lượt duyệt bài hát

module.exports = router