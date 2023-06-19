const { Airports, Areas } = require("../models");
const { Op } = require("sequelize");

class AirportsAndAreasController {
  static async getAirportsAndAreas(req, res) {
    try {
      const { search: key } = req.query;
      const options = {};
      if (key) {
        options.where = {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  code: {
                    [Op.substring]: `%${key}%`,
                  },
                },
                {
                  name: {
                    [Op.substring]: `%${key}%`,
                  },
                },
                {
                  location: {
                    [Op.substring]: `%${key}%`,
                  },
                },
                {
                  country: {
                    [Op.substring]: `%${key}%`,
                  },
                },
              ],
            },
            {
              code: {
                [Op.notIn]: [
                  "JKTA",
                  "TYOA",
                  "SUB",
                  "DPS",
                  "KNO",
                  "JFK",
                  "LAX",
                  "UPG",
                  "SINA",
                  "BKKA",
                  "SYD",
                  "ISTA",
                  "MNL",
                ],
              },
            },
          ],
        };
        options.collate = {
          collation: "utf8_general_ci",
        };
      }
      const areas = await Areas.findAll(options);
      const airports = await Airports.findAll(options);
      res.status(200).json(areas.concat(airports));
    } catch (error) {
      console.log(error);
    }
  }

  static async getPopularAirportsAndAreas(req, res) {
    try {
      const options = {
        where: {
          code: {
            [Op.in]: [
              "JKTA",
              "TYOA",
              "SUB",
              "DPS",
              "KNO",
              "JFK",
              "LAX",
              "UPG",
              "SINA",
              "BKKA",
              "SYD",
              "ISTA",
              "MNL",
            ],
          },
        },
      };
      const areas = await Areas.findAll(options);
      const airports = await Airports.findAll(options);
      res.status(200).json(areas.concat(airports));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AirportsAndAreasController;
