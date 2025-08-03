"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const walletSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        required: true,
    },
    currency: { type: String, default: "BDT" },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.Wallet_Status),
        default: wallet_interface_1.Wallet_Status.UNBLOCKED,
    },
}, { timestamps: true, versionKey: false });
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
