import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Seat = sequelize.define(
  "Seat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    auditorium_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    row_label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seat_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "seats",
    timestamps: false,
  },
);

export default Seat;
