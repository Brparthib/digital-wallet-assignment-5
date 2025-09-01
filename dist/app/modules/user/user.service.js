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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const envCon_1 = require("../../configs/envCon");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const wallet_model_1 = require("../wallet/wallet.model");
const queryBuilder_1 = require("../../utils/queryBuilder");
const user_constant_1 = require("./user.constant");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone, role, password } = payload, rest = __rest(payload, ["phone", "role", "password"]);
    const isUserExists = yield user_model_1.User.findOne({ phone });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Already Exists!!");
    }
    if (role === user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are unauthorized!!");
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, Number(envCon_1.envVars.BCRYPT_SALT_ROUND) | 10);
    const authProvider = {
        provider: "credentials",
        providerId: phone,
    };
    const user = yield user_model_1.User.create(Object.assign({ phone, password: hashedPassword, claimRole: role, auths: [authProvider] }, rest));
    const wallet = yield wallet_model_1.Wallet.create({
        userId: user._id,
        phone: phone,
        balance: Number(envCon_1.envVars.MINIMUM_BALANCE),
    });
    return { user, wallet };
});
const getAllUsers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new queryBuilder_1.QueryBuilder(user_model_1.User.find(), query);
    const users = queryBuilder
        .search(user_constant_1.userSearchField)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        users.build(),
        queryBuilder.getMeta(),
    ]);
    return { data, meta };
});
const getMyProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found!!");
    }
    return user;
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found!!");
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(envCon_1.envVars.BCRYPT_SALT_ROUND) | 10);
    }
    if (payload.status === user_interface_1.User_Status.BLOCKED &&
        decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are unauthorized!!");
    }
    if (payload.approval && decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are unauthorized!!");
    }
    else {
        payload.role = user.claimRole;
    }
    if ((payload.role === user_interface_1.Role.ADMIN || payload.role === user_interface_1.Role.AGENT) &&
        decodedToken.role !== user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are unauthorized!!");
    }
    let message = "";
    if (payload.claimRole === user_interface_1.Role.AGENT && decodedToken.role === user_interface_1.Role.USER) {
        message =
            "You have claimed to be an agent. Please wait for admin approval. You can continue using the wallet as user until you're approved.";
    }
    if (payload.approval && decodedToken.role === user_interface_1.Role.ADMIN) {
        if (payload.approval === user_interface_1.Approval.SUSPEND) {
            payload.role = user_interface_1.Role.USER;
        }
    }
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return { updatedUser, message };
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User Does Not Exists!!");
    }
    yield user_model_1.User.findByIdAndUpdate(userId, { isDeleted: true });
    yield wallet_model_1.Wallet.findByIdAndUpdate(userId, { isDeleted: true });
    return null;
});
exports.userServices = {
    createUser,
    getAllUsers,
    getMyProfile,
    updateUser,
    deleteUser,
};
