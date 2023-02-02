'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clinic_ens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_en: {
        type: Sequelize.INTEGER
      },
      name_en: {
        type: Sequelize.STRING
      },
      address_en: {
        type: Sequelize.STRING
      },
      descriptionHTML_en: {
        type: Sequelize.TEXT
      },
      descriptionMarkdown_en: {
        type: Sequelize.TEXT
      },
      image_en: {
        type: Sequelize.Sequelize.BLOB('long')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clinic_ens');
  }
};