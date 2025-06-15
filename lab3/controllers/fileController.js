const express = require('express');
const multer = require('multer');
const path = require('path');
const FileAnalyzer = require('../services/FileAnalyzer');
require('dotenv').config();

const router = express.Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }

    const fileAnalyzer = new FileAnalyzer(req.file.path, req.file.filename);
    const analysisResult = await fileAnalyzer.analyzeAndSave();

    res.json(analysisResult);
  } catch (err) {
    next(err);
  }
});

module.exports = router;