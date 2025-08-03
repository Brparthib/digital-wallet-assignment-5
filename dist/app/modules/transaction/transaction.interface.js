"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction_Status = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["ADD"] = "ADD";
    TransactionType["WITHDRAW"] = "WITHDRAW";
    TransactionType["SEND"] = "SEND";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var Transaction_Status;
(function (Transaction_Status) {
    Transaction_Status["PENDING"] = "PENDING";
    Transaction_Status["COMPLETE"] = "COMPLETE";
    Transaction_Status["REVERSED"] = "REVERSED";
})(Transaction_Status || (exports.Transaction_Status = Transaction_Status = {}));
