import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const SeatHold = sequelize.define(
  "SeatHold",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showtime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hold_until: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("holding", "released", "booked", "expired"),
      allowNull: false,
      defaultValue: "holding",
    },
  },
  {
    tableName: "seat_holds",
    timestamps: false,
  },
);

export default SeatHold;
