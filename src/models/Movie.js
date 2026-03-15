import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const Movie = sequelize.define(
  "Movie",
  {
    movie_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    trailer: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("upcoming", "now_showing", "ended"),
      allowNull: false,
      defaultValue: "now_showing",
    },
    rating: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "P",
    },
  },
  {
    tableName: "movies",
    timestamps: false,
  },
);

export default Movie;
