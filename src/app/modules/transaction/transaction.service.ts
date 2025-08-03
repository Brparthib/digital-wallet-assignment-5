import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";

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

const getTransactionsById = async (decodedToken: JwtPayload) => {
  const transactions = await Transaction.find({
    $or: [{ fromUser: decodedToken.phone }, { toUser: decodedToken.phone }],
  });
  if (!transactions) {
    throw new AppError(httpStatus.NOT_FOUND, "Transactions Not Found!!");
  }
  const totalTransactions = await Transaction.find({
    $or: [{ fromUser: decodedToken.phone }, { toUser: decodedToken.phone }],
  }).countDocuments();

  return {
    data: transactions,
    meta: {
      total: totalTransactions,
    },
  };
};

export const transactionServices = {
  getAllTransactions,
  getTransactionsById,
};
