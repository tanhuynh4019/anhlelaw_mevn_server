const express = require('express');
const multer = require('multer');
const router = express.Router();
const newsController = require('../../controllers/admin/NewsController');

// plugin multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage }).single('image');

router.get('/api/admin/news', newsController.fetchAllNews);
router.get('/api/admin/news/:id', newsController.fetchByIDNews);
router.patch('/api/admin/news/is_active/:id', newsController.isActiveNews);
router.patch('/api/admin/news/actions', newsController.actionsNews);
router.patch('/api/admin/news/:id', upload, newsController.editNews);
router.post('/api/admin/news', upload, newsController.createNews);
router.patch('/api/admin/news/is_bin/:id', newsController.isBinNews);
router.patch('/api/admin/news/is_comment/:id', newsController.isCommentNews);
router.delete('/api/admin/news/:id', newsController.DeleteNews);
module.exports = router;