'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clinic_En extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clinic_En.hasOne(models.Doctor_Info, {foreignKey: 'id'})
    }
  };
  Clinic_En.init({
    id_en: DataTypes.INTEGER,
    name_en: DataTypes.STRING,
    address_en: DataTypes.STRING,
    descriptionMarkdown_en: DataTypes.TEXT,
    descriptionHTML_en: DataTypes.TEXT,
    image_en: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Clinic_En',
  });
  return Clinic_En;
};