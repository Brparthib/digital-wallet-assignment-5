import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { transactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";

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

const getTransactionsById = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user;
  const transactions = await transactionServices.getTransactionsById(
    verifiedToken
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User's Transaction Retrieved Successfully",
    meta: transactions.meta,
    data: transactions.data,
  });
});

export const transactionControllers = {
  getAllTransactions,
  getTransactionsById,
};
