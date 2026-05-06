"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Profile.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      bio: DataTypes.TEXT,
      userId: {
        // Khóa ngoại liên kết với User
        type: DataTypes.INTEGER,
        unique: true, // Đảm bảo quan hệ One-to-One
      },
    },
    {
      sequelize,
      modelName: "Profile",
      tableName: "profiles",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Profile;
};
