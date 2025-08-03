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
exports.walletControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const wallet_service_1 = require("./wallet.service");
const sendResponse_1 = require("../../utils/sendResponse");
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
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallets = yield wallet_service_1.walletServices.getAllWallets();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Wallets Retrieved Successfully",
        data: wallets.data,
        meta: wallets.meta,
    });
}));
const getWalletByUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield wallet_service_1.walletServices.getWalletByUser(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Wallet Retrieved Successfully",
        data: wallet,
    });
}));
const updateWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const wallet = yield wallet_service_1.walletServices.updateWallet(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: `Wallet ${wallet.status} Successfully`,
        data: wallet,
    });
}));
const sendMoney = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const { toPhone, amount, note } = req.body;
    const transaction = yield wallet_service_1.walletServices.sendMoney(toPhone, amount, note, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Send Money Successful",
        data: transaction,
    });
}));
const cashIn = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const { toPhone, amount } = req.body;
    const transaction = yield wallet_service_1.walletServices.cashIn(toPhone, amount, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Cash In Successful",
        data: transaction,
    });
}));
const cashOut = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const { toPhone, amount } = req.body;
    const transaction = yield wallet_service_1.walletServices.cashOut(toPhone, amount, verifiedToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Send Money Successful",
        data: transaction,
    });
}));
exports.walletControllers = {
    getAllWallets,
    getWalletByUser,
    updateWallet,
    sendMoney,
    cashIn,
    cashOut,
};
