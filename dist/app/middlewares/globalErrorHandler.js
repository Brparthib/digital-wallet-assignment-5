"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const envCon_1 = require("../configs/envCon");
const handleError_1 = require("../errorHelpers/handleError");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const globalErrorHandler = (err, req, res, next) => {
    if (envCon_1.envVars.NODE_ENV === "development") {
        console.log(err);
    }
    let statusCode = 500;
    let message = "Something went wrong!!";
    let errorSources = [];
    //MongoDB Duplicate Error
    if (err.code === 11000) {
        const simplifiedError = (0, handleError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Mongoose Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleError_1.handleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    // Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleError_1.handleValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Zod Error
    else if (err.name === "ZodError") {
        const simplifiedError = (0, handleError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    // Custom Error
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Express Error
    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }
    res.status(statusCode).send({
        success: false,
        message,
        errorSources,
        err: envCon_1.envVars.NODE_ENV === "development" ? err : null,
        stack: envCon_1.envVars.NODE_ENV === "development" ? err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
