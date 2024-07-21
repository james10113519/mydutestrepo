const express = require('express');
const router = express.Router();
const multer = require('multer');
const dataController = require('../controllers/fileController');

const upload = multer({ dest: 'public/uploads/' });

router.post('/upload', upload.single('file'), dataController.uploadCSV);
router.get('/download', dataController.downloadCSV);

module.exports = router;
