const { Hero, HeroImage } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.getAllHeroes = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await Hero.findAndCountAll({
      limit,
      offset,
      include: [{ model: HeroImage, as: 'images',limit: 1 }],
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
      catch_phrase
    } = req.body;

    const newHero = await Hero.create({
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
          heroId: newHero.id,
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    res.status(201).json(newHero);
  } catch (error) {
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


