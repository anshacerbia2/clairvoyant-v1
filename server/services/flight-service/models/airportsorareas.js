"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AirportsOrAreas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AirportsOrAreas.init(
    {
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { message: "Code is required." },
          notEmpty: { message: "Code is required." },
        },
      },
    },
    {
      sequelize,
      modelName: "AirportsOrAreas",
    }
  );
  return AirportsOrAreas;
};
