const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

const Hero = require('./hero')(sequelize, Sequelize);
const HeroImage = require('./heroimage')(sequelize, Sequelize);

Hero.hasMany(HeroImage, {
  foreignKey: 'id',
  as: 'images',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

HeroImage.belongsTo(Hero, {
  foreignKey: 'id',
  as: 'hero'
});

const db = {
  sequelize,
  Sequelize,
  Hero,
  HeroImage
};

module.exports = db;
