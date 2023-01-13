'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Register extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Register.hasMany(models.Schedule, {foreignKey: 'doctorId', as: 'doctorData'})
      // Register.hasMany(models.Booking, {foreignKey: 'patientId', as: 'patientData'})
      // Register.hasMany(models.Booking, {foreignKey: 'doctorId', as: 'doctorData2'})
    }
  };
  Register.init({
    email: DataTypes.STRING,
    random_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Register',
  });
  return Register;
};