import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITransaction } from "./transaction.interface";
import { Transaction } from "./transaction.model";

const makeTransaction = async (payload: ITransaction) => {
  const transaction = await Transaction.create(payload);

  return transaction;
};

const getAllTransactions = async () => {
  const transactions = await Transaction.find({});
  if (!transactions) {
    throw new AppError(httpStatus.NOT_FOUND, "Transactions Not Found!!");
  }
  const totalTransactions = await Transaction.countDocuments();

  return {
    data: transactions,
    meta: {
      total: totalTransactions,
    },
  };
};

const getTransactionByUser = async (userId: string) => {
  const transactions = await Transaction.find({ userId });
  if (!transactions) {
    throw new AppError(httpStatus.NOT_FOUND, "Transactions Not Found!!");
  }
  const totalTransactions = await Transaction.find({ userId }).countDocuments();

  return {
    data: transactions,
    meta: {
      total: totalTransactions,
    },
  };
};

const getTransactionById = async (transactionId: string) => {
  const transaction = await Transaction.findOne({ transactionId });
  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, "Transaction Not Found!!");
  }

  return transaction;
};

export const transactionServices = {
  makeTransaction,
  getAllTransactions,
  getTransactionByUser,
  getTransactionById,
};
