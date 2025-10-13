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
exports.feedbackServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const feedback_model_1 = require("./feedback.model");
const giveFeedback = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(payload.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exists!!");
    }
    const feedback = yield feedback_model_1.Feedback.findOne({ userId: payload.userId });
    if (feedback) {
        return;
    }
    const result = yield feedback_model_1.Feedback.create(payload);
    user.feedback = true;
    user.save();
    return result;
});
exports.feedbackServices = {
    giveFeedback,
};
