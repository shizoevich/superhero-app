// routes/upload.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const cloudinary = require('cloudinary').v2;
const { HeroImage } = require('../models');

// Loading images and saving to DB
router.post('/', upload.array('images', 10), async (req, res) => {
  const { heroId } = req.body;

  if (!heroId) {
    return res.status(400).json({ error: 'heroId' });
  }

  try {
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);

      const imageRecord = await HeroImage.create({
        heroId: parseInt(heroId),
        image_url: result.secure_url,
        is_main: false, 
      });

      uploadedImages.push(imageRecord);
    }

    res.status(201).json({ images: uploadedImages });
  } catch (err) {
    res.status(500).json({ error: 'Error loading images' });
  }
});

module.exports = router;
