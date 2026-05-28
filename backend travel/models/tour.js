"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tour extends Model {
    static associate(models) {
      Tour.belongsTo(models.Category, {
        foreignKey: "category_id",
        as: "category",
      });
      Tour.hasMany(models.Variant, { foreignKey: "tour_id", as: "variants" });
      Tour.hasMany(models.Order, { foreignKey: "tour_id", as: "orders" });
      Tour.hasMany(models.TourImage, { foreignKey: "tour_id", as: "images" });
    }
  }
  Tour.init(
    {
      title: { type: DataTypes.STRING, unique: true, allowNull: false },
      description: DataTypes.TEXT,
      location: DataTypes.STRING,
      destination: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      thumbnail: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      slug: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tour",
      tableName: "tours",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Tour;
};
