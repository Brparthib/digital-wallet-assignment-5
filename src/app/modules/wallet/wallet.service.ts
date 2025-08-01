import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Wallet_Status } from "./wallet.interface";
import { Wallet } from "./wallet.model";

const createWallet = async (userId: string) => {
  const min_amount = 50;

  const wallet = await Wallet.create({
    userId,
    balance: min_amount,
    status: Wallet_Status.ACTIVE,
    currency: "BDT",
  });

  return wallet;
};

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

const getAllWalletByUser = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Data Not Found!!");
  }

  return wallet;
};

const updateBalance = async (userId: string, amount: number) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found!!");
  }

  if (amount < 0) {
    if (wallet.balance < amount) {
      throw new AppError(httpStatus.NOT_FOUND, "Insufficient Balance!!");
    }
    wallet.balance -= amount;
  } else {
    wallet.balance += amount;
  }

  wallet.save();

  return wallet;
};

const toggleWalletStatus = async (
  userId: string,
  status: Wallet_Status.ACTIVE
) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new AppError(httpStatus.NOT_FOUND, "Wallet Not Found!!");
  }

  if (status === (Wallet_Status.DISABLED as string)) {
    wallet.status = Wallet_Status.DISABLED;
  }

  wallet.save();

  return wallet;
};

export const walletServices = {
  createWallet,
  getAllWallets,
  getAllWalletByUser,
  updateBalance,
  toggleWalletStatus,
};
