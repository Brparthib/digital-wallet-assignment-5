import { Types } from "mongoose";

export enum Wallet_Status {
  BLOCKED = "BLOCKED",
  UNBLOCKED = "UNBLOCKED",
}

export interface IWallet {
  userId: Types.ObjectId;
  phone: string;
  balance: number;
  currency?: "BDT";
  status?: Wallet_Status;
}
