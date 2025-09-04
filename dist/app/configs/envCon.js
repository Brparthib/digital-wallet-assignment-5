"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVars = () => {
    const requiredEnvVars = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "ADMIN_PHONE",
        "ADMIN_PASSWORD",
        "AGENT_PHONE",
        "AGENT_PASSWORD",
        "USER_PHONE",
        "USER_PASSWORD",
        "JWT_ACCESS_SECRET",
        "JWT_ACCESS_EXPIRES",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES",
        "MINIMUM_BALANCE",
        "CHARGE_LIMIT",
        "PERCENTAGE_LIMIT",
        "FRONTEND_URL",
    ];
    requiredEnvVars.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing required environment variable ${key}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        NODE_ENV: process.env.NODE_ENV,
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
        ADMIN_PHONE: process.env.ADMIN_PHONE,
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
        AGENT_PHONE: process.env.AGENT_PHONE,
        AGENT_PASSWORD: process.env.AGENT_PASSWORD,
        USER_PHONE: process.env.USER_PHONE,
        USER_PASSWORD: process.env.USER_PASSWORD,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
        MINIMUM_BALANCE: process.env.MINIMUM_BALANCE,
        CHARGE_LIMIT: process.env.CHARGE_LIMIT,
        PERCENTAGE_LIMIT: process.env.PERCENTAGE_LIMIT,
        FRONTEND_URL: process.env.FRONTEND_URL,
    };
};
exports.envVars = loadEnvVars();
