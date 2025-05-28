// models/heroimage.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const HeroImage = sequelize.define('HeroImage', {
    heroId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Heroes',
        key: 'id'
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {});
  
  HeroImage.associate = function(models) {
    HeroImage.belongsTo(models.Hero, { foreignKey: 'heroId', onDelete: 'CASCADE' });
  };

  return HeroImage;
};
