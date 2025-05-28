'use strict';

module.exports = (sequelize, DataTypes) => {
  const Hero = sequelize.define('Hero', {
    // Hero's nickname (required)
    nickname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Hero's real name (required)
    real_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Description of hero's origin (required)
    origin_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // Hero's superpowers description (required)
    superpowers: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    // Hero's catch phrase (required)
    catch_phrase: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Heroes',  
    timestamps: true      
  });

  Hero.associate = function(models) {
    Hero.hasMany(models.HeroImage, {
      foreignKey: 'heroId',
      as: 'images',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Hero;
};

