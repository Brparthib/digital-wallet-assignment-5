import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { addCountryCode } from "../../utils/addCountryCode";

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as Record<string, string>;
  if (query.phone) {
    const formatted = addCountryCode(query.phone, "BD");
    query.phone = formatted as string;
  }
  const wallets = await walletServices.getAllWallets(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallets Retrieved Successfully",
    data: wallets.data,
    meta: wallets.meta,
  });
});

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user as JwtPayload;
  const wallet = await walletServices.getMyWallet(verifiedToken.phone);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet Retrieved Successfully",
    data: wallet,
  });
});

const getUserWallet = catchAsync(async (req: Request, res: Response) => {
  const phone = addCountryCode(req.params.phone, "BD") as string;
  const wallet = await walletServices.getUserWallet(phone);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet Retrieved Successfully",
    data: wallet,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const phone = req.params.phone;
  const status = req.body;
  const wallet = await walletServices.updateWallet(phone, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Wallet ${wallet.status} Successfully`,
    data: wallet,
  });
});

const toggleWalletStatus = catchAsync(async (req: Request, res: Response) => {
  const phone = addCountryCode(req.params.phone, "BD") as string;
  const wallet = await walletServices.toggleWalletStatus(phone);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Wallet ${wallet.status} Successfully`,
    data: wallet,
  });
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user;
  const { toPhone, amount, note } = req.body;
  const transaction = await walletServices.sendMoney(
    toPhone,
    amount,
    note,
    verifiedToken
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Send Money Successful",
    data: transaction,
  });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user;
  const { toPhone, amount } = req.body;
  const transaction = await walletServices.cashIn(
    toPhone,
    amount,
    verifiedToken
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash In Successful",
    data: transaction,
  });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
  const verifiedToken = req.user;
  const { toPhone, amount } = req.body;
  const transaction = await walletServices.cashOut(
    toPhone,
    amount,
    verifiedToken
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Send Money Successful",
    data: transaction,
  });
});

export const walletControllers = {
  getAllWallets,
  getMyWallet,
  getUserWallet,
  updateWallet,
  toggleWalletStatus,
  sendMoney,
  cashIn,
  cashOut,
};
