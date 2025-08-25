import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { transactionServices } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import { addCountryCode } from "../../utils/addCountryCode";

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const transactions = await transactionServices.getAllTransactions(query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Transactions Retrieved Successfully",
    meta: transactions.meta,
    data: transactions.data,
  });
});

const getMyTransactions = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user;
  const query = req.query;

  if (typeof query.fromUser === "string") {
    const formatted = addCountryCode(query.fromUser, "BD");
    if (formatted) {
      query.fromUser = formatted;
    }
  }

  if (typeof query.toUser === "string") {
    const formatted = addCountryCode(query.toUser, "BD");
    if (formatted) {
      query.toUser = formatted;
    }
  }

  const transactions = await transactionServices.getMyTransactions(
    verifiedToken,
    query as Record<string, string>
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
  getMyTransactions,
};
