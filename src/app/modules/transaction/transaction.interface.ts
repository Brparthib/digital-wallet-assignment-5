export enum TransactionType {
  ADD = "ADD",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
}

export enum Transaction_Status {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  REVERSED = "REVERSED",
}

export interface ITransaction {
  transactionId: string;
  type: TransactionType;
  amount: number;
  status: Transaction_Status;
  fromUser: string;
  toUser: string;
  commission?: number;
  fee?: number;
  note?: string;
}
