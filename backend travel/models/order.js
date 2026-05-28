"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Order.belongsTo(models.Tour, { foreignKey: "tour_id", as: "tour" });
      Order.belongsTo(models.Variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
      Order.hasMany(models.Passenger, {
        foreignKey: "order_id",
        as: "passengers",
      });
    }
  }
  Order.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      tour_id: { type: DataTypes.INTEGER, allowNull: false },
      variant_id: DataTypes.INTEGER,
      contact_name: { type: DataTypes.STRING, allowNull: false },
      contact_email: { type: DataTypes.STRING, allowNull: false },
      contact_phone: { type: DataTypes.STRING, allowNull: false },
      contact_address: DataTypes.STRING,
      adult_count: { type: DataTypes.INTEGER, defaultValue: 1 },
      child_count: { type: DataTypes.INTEGER, defaultValue: 0 },
      total_price: { type: DataTypes.BIGINT, allowNull: false },
      payment_method: DataTypes.STRING,
      special_note: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      freezeTableName: true,
      timestamps: true,
    },
  );
  return Order;
};
