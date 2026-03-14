import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const PaymentTransaction = sequelize.define(
  "PaymentTransaction",
  {
    payment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_ref: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    request_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      allowNull: false,
      defaultValue: "pending",
    },
    response_code: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    raw_response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "payment_transactions",
    timestamps: false,
  },
);

export default PaymentTransaction;
