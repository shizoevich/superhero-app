const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const upload = require('../middleware/upload');
const db = require('../models');
const HeroImage = db.HeroImage;
const cloudinary = require('cloudinary').v2;

router.post('/:id/images', async (req, res) => {
  const heroId = req.params.id;
  const { image_url, isMain } = req.body;

  try {
    console.log('Received image_url:', image_url);
    
    let finalImageUrl = image_url;
    let publicId = null;
    
    if (!image_url.includes('cloudinary.com')) {
      const result = await cloudinary.uploader.upload(image_url, {
        folder: 'heroes_images',
      });
      finalImageUrl = result.secure_url;
      publicId = result.public_id;
      console.log('Cloudinary result:', result);
    }

    const newImage = await HeroImage.create({
      heroId: heroId,          
      image_url: finalImageUrl, 
      public_id: publicId,      
      is_main: isMain || false,
    });

    res.status(201).json(newImage);

  } catch (error) {
    console.error('Error in /images route:', error);
    res.status(500).json({ error: 'Failed to add image', details: error.message });
  }
});
// GET heroes (with pagination)
router.get('/', heroController.getAllHeroes);

// GET single hero by ID
router.get('/:id', heroController.getHeroById);

// POST create hero with images
router.post('/', upload.array('images', 10), heroController.createHero);

// PUT update hero (can add/remove images)
router.put('/:id', upload.array('images', 10), heroController.updateHero);

router.put('/images/:imageId/set-main', heroController.setMainImage);

// DELETE hero
router.delete('/:id', heroController.deleteHero);

// routes/heroRoutes.js
router.delete('/images/:imageId', heroController.deleteHeroImage);


module.exports = router;
