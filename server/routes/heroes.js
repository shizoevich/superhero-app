const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const upload = require('../middleware/upload');

// GET heroes (with pagination)
router.get('/', heroController.getAllHeroes);

// GET single hero by ID
router.get('/:id', heroController.getHeroById);

// POST create hero with images
router.post('/', upload.array('images', 10), heroController.createHero);

// PUT update hero (can add/remove images)
router.put('/:id', upload.array('images', 10), heroController.updateHero);

// DELETE hero
router.delete('/:id', heroController.deleteHero);

module.exports = router;
