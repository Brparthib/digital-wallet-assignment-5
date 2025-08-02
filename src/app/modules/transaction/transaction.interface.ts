import { Types } from "mongoose";

export enum TransactionType {
  ADD = "ADD",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
}

export enum Transaction_Status {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface ITransaction {
  transactionId: string;
  type: string;
  amount: number;
  status: Transaction_Status;
  fromUser: Types.ObjectId;
  toUser: Types.ObjectId;
  commission?: number;
  fee?: number;
  note: string;
}
