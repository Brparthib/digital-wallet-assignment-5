"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWalletZodSchema = exports.createWalletZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createWalletZodSchema = zod_1.default.object({
    userId: zod_1.default.string(),
    phone: zod_1.default
        .string({ error: "Phone number must be string." })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
    status: zod_1.default.string().optional(),
});
exports.updateWalletZodSchema = zod_1.default.object({
    status: zod_1.default.enum(["UNBLOCKED", "BLOCKED"]).optional(),
});
