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
const addCountryCode_1 = require("../../utils/addCountryCode");
const getAllWallets = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    if (query.phone) {
        const formatted = (0, addCountryCode_1.addCountryCode)(query.phone, "BD");
        query.phone = formatted;
    }
    const wallets = yield wallet_service_1.walletServices.getAllWallets(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Wallets Retrieved Successfully",
        data: wallets.data,
        meta: wallets.meta,
    });
}));
const getMyWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedToken = req.user;
    const wallet = yield wallet_service_1.walletServices.getMyWallet(verifiedToken.phone);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Wallet Retrieved Successfully",
        data: wallet,
    });
}));
const getUserWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = (0, addCountryCode_1.addCountryCode)(req.params.phone, "BD");
    const wallet = yield wallet_service_1.walletServices.getUserWallet(phone);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Wallet Retrieved Successfully",
        data: wallet,
    });
}));
const updateWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = (0, addCountryCode_1.addCountryCode)(req.params.phone, "BD");
    const { status } = req.body;
    const wallet = yield wallet_service_1.walletServices.updateWallet(phone, status);
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
    getMyWallet,
    getUserWallet,
    updateWallet,
    sendMoney,
    cashIn,
    cashOut,
};
