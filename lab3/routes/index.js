const express = require('express');
const fileController = require('../controllers/fileController')

const router = express.Router()

router.use('/files', fileController)

module.exports = router