import { Types } from "mongoose";

export enum Wallet_Status {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED'
}

export interface IWallet {
    userId: Types.ObjectId,
    phone: string;
    balance: number,
    currency?: "BDT",
    status: Wallet_Status
}