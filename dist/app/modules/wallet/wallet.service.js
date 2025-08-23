"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletServices = void 0;
const transaction_interface_1 = require("./../transaction/transaction.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_interface_1 = require("./wallet.interface");
const wallet_model_1 = require("./wallet.model");
const user_model_1 = require("../user/user.model");
const envCon_1 = require("../../configs/envCon");
const transaction_model_1 = require("../transaction/transaction.model");
const generateTransactionId_1 = require("../../utils/generateTransactionId");
const transaction_interface_2 = require("../transaction/transaction.interface");
const user_interface_1 = require("../user/user.interface");
const getAllWallets = () => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_model_1.Wallet.find({});
    if (!wallets) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Data Not Found!!");
    }
    const totalWallet = yield wallet_model_1.Wallet.countDocuments();
    return {
        data: wallets,
        meta: {
            total: totalWallet,
        },
    };
});
const getWalletByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Data Not Found!!");
    }
    return wallet;
});
const updateWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_model_1.Wallet.findOne({ userId });
    if (!wallet) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Wallet Not Found!!");
    }
    if (wallet.status === wallet_interface_1.Wallet_Status.UNBLOCKED) {
        wallet.status = wallet_interface_1.Wallet_Status.BLOCKED;
    }
    else {
        wallet.status = wallet_interface_1.Wallet_Status.UNBLOCKED;
    }
    wallet.save();
    return wallet;
});
// user can send money to another user
const sendMoney = (toPhone, amount, note, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `${amount === 0 ? "Amount is 0!!" : "Amount is negative number!!"}`);
    }
    const isUserExists = yield user_model_1.User.findOne({ phone: toPhone });
    if (!isUserExists || isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exists!!");
    }
    const senderWallet = yield wallet_model_1.Wallet.findOne({ phone: decodedToken.phone });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ phone: toPhone });
    if (!senderWallet ||
        senderWallet.status === wallet_interface_1.Wallet_Status.BLOCKED ||
        !receiverWallet ||
        receiverWallet.status === wallet_interface_1.Wallet_Status.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked!!");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient Balance!!");
    }
    const fee = (Number(envCon_1.envVars.CHARGE_LIMIT) * amount) / 1000;
    const adminWallet = yield wallet_model_1.Wallet.findOne({ phone: envCon_1.envVars.ADMIN_PHONE });
    if (!adminWallet) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admin does not exists!!");
    }
    adminWallet.balance += fee;
    const sendAmount = amount - fee;
    senderWallet.balance -= amount;
    receiverWallet.balance += sendAmount;
    senderWallet.save();
    receiverWallet.save();
    adminWallet.save();
    const transaction = (yield transaction_model_1.Transaction.create({
        transactionId: (0, generateTransactionId_1.generateTransactionId)(),
        type: transaction_interface_2.TransactionType.SEND,
        amount: amount,
        fromUser: decodedToken.phone,
        toUser: toPhone,
        fee: fee,
        status: transaction_interface_1.Transaction_Status.COMPLETE,
        note: note,
    }));
    return transaction;
});
// user can add money by agent, agent can add money to user. (top-up)
const cashIn = (toPhone, amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `${amount === 0 ? "Amount is 0!!" : "Amount is negative number!!"}`);
    }
    if (decodedToken.role === user_interface_1.Role.AGENT &&
        decodedToken.approval === user_interface_1.Approval.SUSPEND) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are unauthorized!!");
    }
    const isUserExists = yield user_model_1.User.findOne({ phone: toPhone });
    if (!isUserExists || isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exists!!");
    }
    const senderWallet = yield wallet_model_1.Wallet.findOne({ phone: decodedToken.phone });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ phone: toPhone });
    if (!senderWallet ||
        senderWallet.status === wallet_interface_1.Wallet_Status.BLOCKED ||
        !receiverWallet ||
        receiverWallet.status === wallet_interface_1.Wallet_Status.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked!!");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient Balance!!");
    }
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;
    senderWallet.save();
    receiverWallet.save();
    const transaction = (yield transaction_model_1.Transaction.create({
        transactionId: (0, generateTransactionId_1.generateTransactionId)(),
        type: transaction_interface_2.TransactionType.ADD,
        amount: amount,
        fromUser: decodedToken.phone,
        toUser: toPhone,
        status: transaction_interface_1.Transaction_Status.COMPLETE,
    }));
    return transaction;
});
// user can withdraw money by agent, agent can withdraw money from user.
const cashOut = (toPhone, amount, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `${amount === 0 ? "Amount is 0!!" : "Amount is negative number!!"}`);
    }
    const isUserExists = yield user_model_1.User.findOne({ phone: toPhone });
    if (!isUserExists || isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exists!!");
    }
    if (isUserExists.role === user_interface_1.Role.AGENT &&
        isUserExists.approval === user_interface_1.Approval.SUSPEND) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Unauthorized agent!!");
    }
    const senderWallet = yield wallet_model_1.Wallet.findOne({ phone: decodedToken.phone });
    const receiverWallet = yield wallet_model_1.Wallet.findOne({ phone: toPhone });
    if (!senderWallet ||
        senderWallet.status === wallet_interface_1.Wallet_Status.BLOCKED ||
        !receiverWallet ||
        receiverWallet.status === wallet_interface_1.Wallet_Status.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Wallet is blocked!!");
    }
    if (senderWallet.balance < amount) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Insufficient Balance!!");
    }
    const fee = (Number(envCon_1.envVars.CHARGE_LIMIT) * amount) / 1000;
    const commission = fee * (Number(envCon_1.envVars.PERCENTAGE_LIMIT) / 100);
    const adminWallet = yield wallet_model_1.Wallet.findOne({ phone: envCon_1.envVars.ADMIN_PHONE });
    if (!adminWallet) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Admin does not exists!!");
    }
    adminWallet.balance += fee;
    const sendAmount = amount - fee;
    senderWallet.balance -= amount;
    receiverWallet.balance += sendAmount;
    senderWallet.save();
    receiverWallet.save();
    adminWallet.save();
    const transaction = (yield transaction_model_1.Transaction.create({
        transactionId: (0, generateTransactionId_1.generateTransactionId)(),
        type: transaction_interface_2.TransactionType.WITHDRAW,
        amount: amount,
        fromUser: decodedToken.phone,
        toUser: toPhone,
        commission: commission,
        fee: fee - commission,
        status: transaction_interface_1.Transaction_Status.COMPLETE,
    }));
    return transaction;
});
exports.walletServices = {
    getAllWallets,
    getWalletByUser,
    updateWallet,
    sendMoney,
    cashIn,
    cashOut,
};
