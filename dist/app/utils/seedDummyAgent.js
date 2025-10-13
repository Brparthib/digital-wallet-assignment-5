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
exports.seedDummyAgent = void 0;
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
const envCon_1 = require("../configs/envCon");
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../modules/wallet/wallet.model");
const seedDummyAgent = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminExists = yield user_model_1.User.findOne({
            phone: envCon_1.envVars.AGENT_PHONE,
        });
        if (isAdminExists) {
            console.log("Agent Already Exists!!");
            return;
        }
        console.log("Trying To Create Dummy Agent...");
        const hashedPassword = yield bcryptjs_1.default.hash(envCon_1.envVars.AGENT_PASSWORD, Number(envCon_1.envVars.BCRYPT_SALT_ROUND) | 10);
        const authProvider = {
            provider: "credentials",
            providerId: envCon_1.envVars.AGENT_PHONE,
        };
        const payload = {
            name: "Agent",
            phone: envCon_1.envVars.AGENT_PHONE,
            password: hashedPassword,
            role: user_interface_1.Role.AGENT,
            approval: user_interface_1.Approval.APPROVED,
            isVerified: true,
            auths: [authProvider],
        };
        const agent = yield user_model_1.User.create(payload);
        const wallet = yield wallet_model_1.Wallet.create({
            userId: agent._id,
            phone: agent.phone,
            balance: Number(envCon_1.envVars.MINIMUM_BALANCE),
        });
        console.log(`Agent created successfully with ${wallet.balance} Tk wallet.`);
        console.log({ agent, wallet });
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedDummyAgent = seedDummyAgent;
