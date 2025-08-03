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
exports.transactionServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_model_1 = require("./transaction.model");
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({});
    if (!transactions) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Transactions Not Found!!");
    }
    const totalTransactions = yield transaction_model_1.Transaction.countDocuments();
    return {
        data: transactions,
        meta: {
            total: totalTransactions,
        },
    };
});
const getTransactionsById = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.Transaction.find({
        $or: [{ fromUser: decodedToken.phone }, { toUser: decodedToken.phone }],
    });
    if (!transactions) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Transactions Not Found!!");
    }
    const totalTransactions = yield transaction_model_1.Transaction.find({
        $or: [{ fromUser: decodedToken.phone }, { toUser: decodedToken.phone }],
    }).countDocuments();
    return {
        data: transactions,
        meta: {
            total: totalTransactions,
        },
    };
});
exports.transactionServices = {
    getAllTransactions,
    getTransactionsById,
};
