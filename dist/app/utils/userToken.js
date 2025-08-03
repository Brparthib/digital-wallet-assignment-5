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
exports.createNewAccessToken = exports.createUserTokens = void 0;
const user_interface_1 = require("./../modules/user/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const envCon_1 = require("../configs/envCon");
const user_model_1 = require("../modules/user/user.model");
const jwt_1 = require("./jwt");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const createUserTokens = (user) => {
    const jwtPayload = {
        userId: user._id,
        phone: user.phone,
        role: user.role,
        approval: user.approval,
    };
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, envCon_1.envVars.JWT_ACCESS_SECRET, envCon_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = (0, jwt_1.generateToken)(jwtPayload, envCon_1.envVars.JWT_REFRESH_SECRET, envCon_1.envVars.JWT_REFRESH_EXPIRES);
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
const createNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, envCon_1.envVars.JWT_REFRESH_SECRET);
    const isUserExists = yield user_model_1.User.findOne({
        phone: verifiedRefreshToken.phone,
    });
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist!!");
    }
    if (isUserExists.status === user_interface_1.User_Status.BLOCKED ||
        isUserExists.status === user_interface_1.User_Status.INACTIVE) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExists.status}!!`);
    }
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted!!");
    }
    const jwtPayload = {
        userId: isUserExists._id,
        phone: isUserExists.phone,
        role: isUserExists.role,
        approval: isUserExists.approval,
    };
    const newAccessToken = (0, jwt_1.generateToken)(jwtPayload, envCon_1.envVars.JWT_ACCESS_SECRET, envCon_1.envVars.JWT_ACCESS_EXPIRES);
    return newAccessToken;
});
exports.createNewAccessToken = createNewAccessToken;
