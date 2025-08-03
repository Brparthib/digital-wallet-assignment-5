import { model, Schema } from "mongoose";
import {
  ITransaction,
  Transaction_Status,
  TransactionType,
} from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Transaction_Status),
      default: Transaction_Status.PENDING,
    },
    fromUser: {
      type: String,
      required: true,
    },
    toUser: {
      type: String,
      required: true,
    },
    commission: {
      type: Number,
      default: 0,
    },
    fee: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
