import { model, Schema } from "mongoose";
import { IWallet, Wallet_Status } from "./wallet.interface";

const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    currency: { type: String, default: "BDT" },
    status: {
      type: String,
      enum: Object.values(Wallet_Status),
      default: Wallet_Status.UNBLOCKED,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Wallet = model<IWallet>("Wallet", walletSchema);
