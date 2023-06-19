"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    try {
      const data = require("../data/airports-or-areas.json")
        .filter((obj) => obj.airportDisplay !== null)
        .map((v) => {
          const {
            code,
            name,
            location,
            shortLocation,
            country,
            areaCode,
            airportIcaoCode,
          } = v.airportDisplay;
          return {
            code,
            name,
            location,
            shortLocation,
            country,
            areaCode,
            airportIcaoCode,
            score: v.score,
            updatedAt: new Date(),
            createdAt: new Date(),
          };
        });
      await queryInterface.bulkInsert("Airports", data, {});
    } catch (error) {
      console.log(error);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Airports", null, {});
  },
};
