'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Specialty_En extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Specialty_En.hasOne(models.Doctor_Info, {foreignKey: 'id'})

    }
  };
  Specialty_En.init({
    name: DataTypes.STRING,
    descriptionMarkdown: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    image: DataTypes.TEXT,
    isDelete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Specialty_En',
  });
  return Specialty_En;
};