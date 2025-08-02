import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { transactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";

const makeTransaction = catchAsync(async (req: Request, res: Response) => {
  const transaction = await transactionServices.makeTransaction(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Transaction Successful",
    data: transaction,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await transactionServices.getAllTransactions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Transactions Retrieved Successfully",
    meta: transactions.meta,
    data: transactions.data,
  });
});

const getTransactionByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const transactions = await transactionServices.getTransactionByUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's Transaction Retrieved Successfully",
    meta: transactions.meta,
    data: transactions.data,
  });
});
const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.params.id;
  const transaction = await transactionServices.getTransactionById(
    transactionId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Transaction Retrieved Successfully",
    data: transaction,
  });
});

export const transactionControllers = {
  makeTransaction,
  getAllTransactions,
  getTransactionByUser,
  getTransactionById,
};
