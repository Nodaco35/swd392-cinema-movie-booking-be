import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Cinema = sequelize.define(
  "Cinema",
  {
    cinema_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "cinemas",
    timestamps: false,
  },
);

export default Cinema;
