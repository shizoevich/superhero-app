const { Hero, HeroImage } = require('../models');
const cloudinary = require('cloudinary').v2;


exports.getAllHeroes = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await Hero.findAndCountAll({
      limit,
      offset,
      include: [{
  model: HeroImage,
  as: 'images',
  where: { is_main: true },
  required: false 
}]
,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      heroes: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHeroById = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id, {
      include: [{model: HeroImage, as: 'images'}],
    });
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createHero = async (req, res) => {
  try {
    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase,
      main_image_url
    } = req.body;

    const newHero = await Hero.create({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase
    });

    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'heroes_images',
      });

      await HeroImage.create({
        heroId: newHero.id,
        image_url: result.secure_url,
        public_id: result.public_id,
        is_main: true,
      });

    } else if (main_image_url && main_image_url.trim() !== '') {
      let finalUrl = main_image_url;
      let publicId = null;

      if (!main_image_url.includes('cloudinary.com')) {
        const result = await cloudinary.uploader.upload(main_image_url, {
          folder: 'heroes_images',
        });
        finalUrl = result.secure_url;
        publicId = result.public_id;
      }

      await HeroImage.create({
        heroId: newHero.id,
        image_url: finalUrl,
        public_id: publicId,
        is_main: true,
      });
    }

    res.status(201).json({ hero: newHero });

  } catch (error) {
    console.error('Error creating hero:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.updateHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Hero not found' });

    const {
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase
    } = req.body;

    await hero.update({
      nickname,
      real_name,
      origin_description,
      superpowers,
      catch_phrase
    });

    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        await HeroImage.create({
          heroId: hero.id,
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    res.json(hero);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/heroController.js
exports.setMainImage = async (req, res) => {
  try {
    const image = await HeroImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    await HeroImage.update({ is_main: false }, { where: { heroId: image.heroId } });
image.is_main = true;
await image.save();

    res.json({ message: 'Main image set' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByPk(req.params.id, { include: { model: HeroImage, as: 'images' } });
    if (!hero) return res.status(404).json({ error: 'Hero not found' });

    if (hero.images && hero.images.length > 0) {
      for (const image of hero.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
        await image.destroy();
      }
    }

    await hero.destroy();
    res.json({ message: 'Hero deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteHeroImage = async (req, res) => {
  try {
    const image = await HeroImage.findByPk(req.params.imageId);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await image.destroy();
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


