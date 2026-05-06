"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TourImage extends Model {
    static associate(models) {
      TourImage.belongsTo(models.Tour, { foreignKey: "tour_id", as: "tour" });
    }
  }
  TourImage.init(
    {
      tour_id: { type: DataTypes.INTEGER, allowNull: false },
      image_url: { type: DataTypes.STRING, allowNull: false },
      is_thumbnail: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      modelName: "TourImage",
      tableName: "tour_images",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return TourImage;
};
