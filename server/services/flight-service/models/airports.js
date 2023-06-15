"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Airports.init(
    {
      code: DataTypes.STRING,
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      shortLocation: DataTypes.STRING,
      country: DataTypes.STRING,
      areaCode: DataTypes.STRING,
      airportIcaoCode: DataTypes.STRING,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Airports",
    }
  );
  return Airports;
};
