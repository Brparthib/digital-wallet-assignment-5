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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionServices = void 0;
const transaction_model_1 = require("./transaction.model");
const queryBuilder_1 = require("../../utils/queryBuilder");
const transaction_constant_1 = require("./transaction.constant");
const getAllTransactions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find(), query);
    const myTransactions = yield queryBuilder
        .search(transaction_constant_1.transactionSearchField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        myTransactions.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getMyTransactions = (decodedToken, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find({
        $or: [{ fromUser: decodedToken.phone }, { toUser: decodedToken.phone }],
    }), query);
    const myTransactions = yield queryBuilder
        .search(transaction_constant_1.transactionSearchField)
        .filter()
        .paginate();
    const [data, meta] = yield Promise.all([
        myTransactions.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
exports.transactionServices = {
    getAllTransactions,
    getMyTransactions,
};
