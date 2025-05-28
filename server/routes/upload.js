const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/upload', upload.array('images', 10), (req, res) => {
  const uploadedImages = req.files.map(file => file.path);
  res.status(200).json({ images: uploadedImages });
});

module.exports = router;
