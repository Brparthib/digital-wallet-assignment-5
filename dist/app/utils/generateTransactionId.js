"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
const crypto_1 = require("crypto");
const generateTransactionId = () => {
    const timestamp = Date.now();
    const randomHex = (0, crypto_1.randomBytes)(4).toString("hex");
    return `Tran-${timestamp}-${randomHex}`;
};
exports.generateTransactionId = generateTransactionId;
