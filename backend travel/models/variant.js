"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Variant extends Model {
    static associate(models) {
      Variant.belongsTo(models.Tour, {
        foreignKey: "tour_id", // Tên khóa ngoại trong bảng Variant
        as: "tour", // Alias để truy vấn quan hệ
      });
    }
  }
  Variant.init(
    {
      start_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      discount_percent: DataTypes.INTEGER,
      final_price: DataTypes.INTEGER,
      child_discount_percent: DataTypes.INTEGER,
      tour_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Variant",
      tableName: "variants",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Variant;
};
