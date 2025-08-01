import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletServices } from "./wallet.service";
import { sendResponse } from "../../utils/sendResponse";

const createWallet = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const wallet = await walletServices.createWallet(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Wallet Created Successfully",
    data: wallet,
  });
});

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

const getAllWalletByUser = catchAsync(async (req: Request, res: Response) => {
  const wallet = await walletServices.getAllWalletByUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet Retrieved Successfully",
    data: wallet,
  });
});

const updateBalance = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { amount } = req.body;
  const wallet = await walletServices.updateBalance(userId, amount);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wallet Updated Successfully",
    data: wallet,
  });
});

const toggleWalletStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { status } = req.body;
  const wallet = await walletServices.toggleWalletStatus(
    userId,
    status.toUpperCase()
  );
  console.log(status.toUpperCase());

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Wallet ${status} Successfully`,
    data: wallet,
  });
});

export const walletControllers = {
  createWallet,
  getAllWallets,
  getAllWalletByUser,
  updateBalance,
  toggleWalletStatus,
};
