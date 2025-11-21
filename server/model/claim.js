// model/claim.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Claim = sequelize.define(
  "Claim",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "validate", "approve"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "claims",
    underscored: true,
    timestamps: true,
  }
);

module.exports = Claim;
