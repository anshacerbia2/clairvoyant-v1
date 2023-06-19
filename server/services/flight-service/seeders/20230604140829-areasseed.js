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
        .filter((obj) => obj.areaDisplay !== null)
        .map((v) => {
          const { code, name, location, country, iataCode, airports } =
            v.areaDisplay;
          return {
            code,
            name,
            location,
            country,
            iataCode,
            airports: JSON.stringify(airports),
            score: v.score,
            updatedAt: new Date(),
            createdAt: new Date(),
          };
        });
      await queryInterface.bulkInsert("Areas", data, {});
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
    await queryInterface.bulkDelete("Areas", null, {});
  },
};
