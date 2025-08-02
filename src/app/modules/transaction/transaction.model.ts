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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commission: {
      type: Number,
    },
    fee: {
      type: Number,
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
