"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = require("mongoose");
const feedbackSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    message: {
        type: String,
        default: "",
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Feedback = (0, mongoose_1.model)("Feedback", feedbackSchema);
