import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const PaymentTransaction = sequelize.define(
  "PaymentTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "payment_transactions",
    timestamps: false,
  },
);

export default PaymentTransaction;
