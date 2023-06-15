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
          airports,
          score: v.score,
          updatedAt: new Date(),
          createdAt: new Date(),
        };
      });
    console.log(data);
    await queryInterface.bulkInsert("Areas", data, {});
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
