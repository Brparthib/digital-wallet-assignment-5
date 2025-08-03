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
const mongoose_1 = __importDefault(require("mongoose"));
const envCon_1 = require("./app/configs/envCon");
const app_1 = __importDefault(require("./app"));
const seedAdmin_1 = require("./app/utils/seedAdmin");
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(envCon_1.envVars.DB_URL);
        console.log(`Connected To DB...!`);
        server = app_1.default.listen(envCon_1.envVars.PORT, () => {
            console.log(`Server is listening to port ${envCon_1.envVars.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    startServer();
    (0, seedAdmin_1.seedAdmin)();
}))();
// unhandled rejection error handler
process.on("unhandledRejection", (err) => {
    console.log("unhandled rejection detected... server shutting down... ", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// uncaught exception error handler
process.on("uncaughtException", (err) => {
    console.log("uncaught exception detected... server shutting down... ", err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// signal termination handler
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received... server shutting down... ");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
