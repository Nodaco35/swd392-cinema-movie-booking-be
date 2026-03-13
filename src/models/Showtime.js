import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Showtime = sequelize.define(
  "Showtime",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movie_id: {
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
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    base_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "showtimes",
    timestamps: false,
  },
);

export default Showtime;
