"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.transactionZodSchema = zod_1.default.object({
    transactionId: zod_1.default.string(),
    type: zod_1.default.string(),
    amount: zod_1.default.number(),
    status: zod_1.default.string(),
    fromUser: zod_1.default.string(),
    toUser: zod_1.default.string(),
    commission: zod_1.default.string().optional(),
    note: zod_1.default.string(),
});
