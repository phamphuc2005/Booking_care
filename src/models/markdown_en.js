'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Markdown_En extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Markdown_En.belongsTo(models.User, {foreignKey: 'doctorId'})
    }
  };
  Markdown_En.init({
    doctorId: DataTypes.INTEGER,
    description: DataTypes.TEXT('long'),
    contentHTML: DataTypes.TEXT('long'),
    contentMarkdown: DataTypes.TEXT('long'),
  }, {
    sequelize,
    modelName: 'Markdown_En',
  });
  return Markdown_En;
};