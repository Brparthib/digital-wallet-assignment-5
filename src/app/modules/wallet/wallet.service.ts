import { Transaction_Status } from "./../transaction/transaction.interface";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet_Status } from "./wallet.interface";
import { Wallet } from "./wallet.model";
import { User } from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../configs/envCon";
import { Transaction } from "../transaction/transaction.model";
import { generateTransactionId } from "../../utils/generateTransactionId";
import {
  ITransaction,
  TransactionType,
} from "../transaction/transaction.interface";
import { Approval, Role } from "../user/user.interface";

const getAllWallets = async () => {
  const wallets = await Wallet.find({});
  if (!wallets) {
    throw new AppError(httpStatus.NOT_FOUND, "Data Not Found!!");
  }

  const totalWallet = await Wallet.countDocuments();

  return {
    data: wallets,
    meta: {
      total: totalWallet,
    },
  };
};

const getWalletByUser = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Data Not Found!!");
  }

  return wallet;
};

const updateWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found!!");
  }

  if (wallet.status === Wallet_Status.UNBLOCKED) {
    wallet.status = Wallet_Status.BLOCKED;
  } else {
    wallet.status = Wallet_Status.UNBLOCKED;
  }

  wallet.save();

  return wallet;
};

// user can send money to another user
const sendMoney = async (
  toPhone: string,
  amount: number,
  note: "",
  decodedToken: JwtPayload
) => {
  if (amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${amount === 0 ? "Amount is 0!!" : "Amount is negative number!!"}`
    );
  }

  const isUserExists = await User.findOne({ phone: toPhone });
  if (!isUserExists || isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!");
  }

  const senderWallet = await Wallet.findOne({ phone: decodedToken.phone });
  const receiverWallet = await Wallet.findOne({ phone: toPhone });
  if (
    !senderWallet ||
    senderWallet.status === Wallet_Status.BLOCKED ||
    !receiverWallet ||
    receiverWallet.status === Wallet_Status.BLOCKED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked!!");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance!!");
  }

  const fee = (Number(envVars.CHARGE_LIMIT) * amount) / 1000;

  const adminWallet = await Wallet.findOne({ phone: envVars.ADMIN_PHONE });
  if (!adminWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin does not exists!!");
  }

  adminWallet.balance += fee;

  const sendAmount = amount - fee;

  senderWallet.balance -= amount;
  receiverWallet.balance += sendAmount;

  senderWallet.save();
  receiverWallet.save();
  adminWallet.save();

  const transaction = (await Transaction.create({
    transactionId: generateTransactionId(),
    type: TransactionType.SEND,
    amount: amount,
    fromUser: decodedToken.phone,
    toUser: toPhone,
    fee: fee,
    status: Transaction_Status.COMPLETE,
    note: note,
  })) as ITransaction;

  return transaction;
};

// user can add money by agent, agent can add money to user. (top-up)
const cashIn = async (
  toPhone: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  if (amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${amount === 0 ? "Amount is 0!!" : "Amount is negative number!!"}`
    );
  }

  if (
    decodedToken.role === Role.AGENT &&
    decodedToken.approval === Approval.SUSPEND
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized!!");
  }

  const isUserExists = await User.findOne({ phone: toPhone });
  if (!isUserExists || isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!");
  }

  const senderWallet = await Wallet.findOne({ phone: decodedToken.phone });
  const receiverWallet = await Wallet.findOne({ phone: toPhone });

  if (
    !senderWallet ||
    senderWallet.status === Wallet_Status.BLOCKED ||
    !receiverWallet ||
    receiverWallet.status === Wallet_Status.BLOCKED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked!!");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance!!");
  }

  senderWallet.balance -= amount;
  receiverWallet.balance += amount;

  senderWallet.save();
  receiverWallet.save();

  const transaction = (await Transaction.create({
    transactionId: generateTransactionId(),
    type: TransactionType.ADD,
    amount: amount,
    fromUser: decodedToken.phone,
    toUser: toPhone,
    status: Transaction_Status.COMPLETE,
  })) as ITransaction;

  return transaction;
};

// user can withdraw money by agent, agent can withdraw money from user.
const cashOut = async (
  toPhone: string,
  amount: number,
  decodedToken: JwtPayload
) => {
  if (amount <= 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `${amount === 0 ? "Amount is 0!!" : "Amount is negative number!!"}`
    );
  }

  const isUserExists = await User.findOne({ phone: toPhone });
  if (!isUserExists || isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!");
  }

  if (
    isUserExists.role === Role.AGENT &&
    isUserExists.approval === Approval.SUSPEND
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Unauthorized agent!!");
  }

  const senderWallet = await Wallet.findOne({ phone: decodedToken.phone });
  const receiverWallet = await Wallet.findOne({ phone: toPhone });

  if (
    !senderWallet ||
    senderWallet.status === Wallet_Status.BLOCKED ||
    !receiverWallet ||
    receiverWallet.status === Wallet_Status.BLOCKED
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, "Wallet is blocked!!");
  }

  if (senderWallet.balance < amount) {
    throw new AppError(httpStatus.BAD_REQUEST, "Insufficient Balance!!");
  }

  const fee = (Number(envVars.CHARGE_LIMIT) * amount) / 1000;
  const commission = fee * (Number(envVars.PERCENTAGE_LIMIT) / 100);

  const adminWallet = await Wallet.findOne({ phone: envVars.ADMIN_PHONE });
  if (!adminWallet) {
    throw new AppError(httpStatus.BAD_REQUEST, "Admin does not exists!!");
  }

  adminWallet.balance += fee;

  const sendAmount = amount - fee;

  senderWallet.balance -= amount;
  receiverWallet.balance += sendAmount;

  senderWallet.save();
  receiverWallet.save();
  adminWallet.save();

  const transaction = (await Transaction.create({
    transactionId: generateTransactionId(),
    type: TransactionType.WITHDRAW,
    amount: amount,
    fromUser: decodedToken.phone,
    toUser: toPhone,
    commission: commission,
    fee: fee - commission,
    status: Transaction_Status.COMPLETE,
  })) as ITransaction;

  return transaction;
};

export const walletServices = {
  getAllWallets,
  getWalletByUser,
  updateWallet,
  sendMoney,
  cashIn,
  cashOut,
};
