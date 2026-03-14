import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Auditorium = sequelize.define(
  "Auditorium",
  {
    auditorium_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("2D", "3D", "IMAX", "4DX"),
      allowNull: false,
      defaultValue: "2D",
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cinema_id: {
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
