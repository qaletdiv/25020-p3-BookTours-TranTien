"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Tour, {
        foreignKey: "category_id", // Tên khóa ngoại trong bảng Tour
        as: "Tours", // Alias để truy vấn quan hệ
      });
    }
  }
  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Category;
};
