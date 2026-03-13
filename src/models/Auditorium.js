import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Auditorium = sequelize.define(
  "Auditorium",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cinema_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "auditorium",
    timestamps: false,
  },
);

export default Auditorium;
