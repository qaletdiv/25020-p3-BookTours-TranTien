"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Passenger extends Model {
    static associate(models) {
      Passenger.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }
  Passenger.init(
    {
      order_id: { type: DataTypes.INTEGER, allowNull: false },
      full_name: { type: DataTypes.STRING, allowNull: false },
      sex: DataTypes.STRING,
      birthday: DataTypes.STRING,
      type: {
        type: DataTypes.ENUM("adult", "child"),
        defaultValue: "adult",
      },
    },
    {
      sequelize,
      modelName: "Passenger",
      tableName: "passengers",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Passenger;
};
