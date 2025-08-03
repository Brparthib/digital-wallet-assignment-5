"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transaction_interface_1.Transaction_Status),
        default: transaction_interface_1.Transaction_Status.PENDING,
    },
    fromUser: {
        type: String,
        required: true,
    },
    toUser: {
        type: String,
        required: true,
    },
    commission: {
        type: Number,
        default: 0,
    },
    fee: {
        type: Number,
        default: 0,
    },
    note: {
        type: String,
    },
}, { timestamps: true, versionKey: false });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
