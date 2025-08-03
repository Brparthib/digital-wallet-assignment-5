import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";

// const createWallet = catchAsync(async (req: Request, res: Response) => {
//   const { userId } = req.body;
//   const wallet = await walletServices.createWallet(userId);

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Wallet Created Successfully",
//     data: wallet,
//   });
// });

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
  const wallets = await walletServices.getAllWallets();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallets Retrieved Successfully",
    data: wallets.data,
    meta: wallets.meta,
  });
});

const getWalletByUser = catchAsync(async (req: Request, res: Response) => {
  const wallet = await walletServices.getWalletByUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet Retrieved Successfully",
    data: wallet,
  });
});

const updateWallet = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const wallet = await walletServices.updateWallet(userId);

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
  getWalletByUser,
  updateWallet,
  sendMoney,
  cashIn,
  cashOut,
};
