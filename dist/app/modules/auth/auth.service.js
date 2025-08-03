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
exports.authServices = void 0;
/* eslint-disable @typescript-eslint/no-non-null-assertion */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userToken_1 = require("../../utils/userToken");
const envCon_1 = require("../../configs/envCon");
const credentialLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, password } = payload;
    const isUserExists = yield user_model_1.User.findOne({ phone });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Doesn't Exists!!");
    }
    const isPasswordMatched = yield bcryptjs_1.default.compare(password, isUserExists.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Incorrect Password!!");
    }
    const userTokens = (0, userToken_1.createUserTokens)(isUserExists);
    delete isUserExists.toObject().password;
    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: isUserExists,
    };
});
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccessToken = yield (0, userToken_1.createNewAccessToken)(refreshToken);
    return {
        accessToken: newAccessToken,
    };
});
const resetPassword = (decodedToken, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    const validPassword = yield bcryptjs_1.default.compare(oldPassword, user.password);
    if (!validPassword) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Old password does not match!!");
    }
    user.password = yield bcryptjs_1.default.hash(newPassword, Number(envCon_1.envVars.BCRYPT_SALT_ROUND) | 10);
    user.save();
});
exports.authServices = {
    credentialLogin,
    getNewAccessToken,
    resetPassword,
};
