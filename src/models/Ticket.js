import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movie_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    showtime_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cinema_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    auditorium_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seat_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    seat_label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "tickets",
    timestamps: false,
  },
);

export default Ticket;
