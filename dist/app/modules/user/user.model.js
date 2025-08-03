"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
}, {
    versionKey: false,
    _id: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, },
    password: { type: String },
    picture: { type: String },
    address: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    approval: {
        type: String,
        enum: Object.values(user_interface_1.Approval),
        default: user_interface_1.Approval.SUSPEND,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: {
        type: String,
        enum: Object.values(user_interface_1.User_Status),
        default: user_interface_1.User_Status.ACTIVE,
    },
    auths: [authProviderSchema],
}, { timestamps: true, versionKey: false });
exports.User = (0, mongoose_1.model)("User", userSchema);
