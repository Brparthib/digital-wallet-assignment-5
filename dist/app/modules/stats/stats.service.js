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
Object.defineProperty(exports, "__esModule", { value: true });
exports.statsServices = void 0;
const transaction_interface_1 = require("../transaction/transaction.interface");
const transaction_model_1 = require("../transaction/transaction.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = yield user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({
        status: user_interface_1.User_Status.ACTIVE,
    });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({
        status: user_interface_1.User_Status.INACTIVE,
    });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({
        status: user_interface_1.User_Status.BLOCKED,
    });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        // stage-1: Grouping users by role and count total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 },
            },
        },
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole,] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise,
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole,
    };
});
const getAllTransactionStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalTransactionPromise = transaction_model_1.Transaction.countDocuments();
    const totalAddTransactionPromise = transaction_model_1.Transaction.countDocuments({
        type: transaction_interface_1.TransactionType.ADD,
    });
    const totalWithdrawTransactionPromise = transaction_model_1.Transaction.countDocuments({
        type: transaction_interface_1.TransactionType.WITHDRAW,
    });
    const totalSendTransactionPromise = transaction_model_1.Transaction.countDocuments({
        type: transaction_interface_1.TransactionType.SEND,
    });
    const newTransactionInLast7DaysPromise = transaction_model_1.Transaction.countDocuments({
        createdAt: { $gte: sevenDaysAgo },
    });
    const newTransactionInLast30DaysPromise = transaction_model_1.Transaction.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
    });
    const totalFeePromise = transaction_model_1.Transaction.aggregate([
        {
            $group: {
                _id: "$fee",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalCommissionPromise = transaction_model_1.Transaction.aggregate([
        {
            $group: {
                _id: "$commission",
                count: { $sum: 1 },
            },
        },
    ]);
    const totalRevenuePromise = transaction_model_1.Transaction.aggregate([
        {
            $match: { status: "COMPLETE" }, // only completed transactions
        },
        {
            $addFields: {
                adminRevenue: {
                    $cond: [
                        // if type is SEND then only admin will get full fee
                        { $eq: ["$type", "SEND"] },
                        { $ifNull: ["$fee", 0] },
                        {
                            // else when withdrawal then admin will get 80% of fee
                            $multiply: [{ $ifNull: ["$fee", 0] }, 0.8],
                        },
                    ],
                },
                agentCommission: {
                    $cond: [
                        // if type is withdraw then agent will get 20% of fee as commission
                        { $eq: ["$type", "WITHDRAW"] },
                        { $multiply: [{ $ifNull: ["$fee", 0] }, 0.2] },
                        0,
                    ],
                },
                day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                month: { $dateToString: { format: "%b-%Y", date: "$createdAt" } },
            },
        },
        {
            $group: {
                _id: null,
                totalFees: { $sum: { $ifNull: ["$fee", 0] } },
                totalAdminRevenue: { $sum: "$adminRevenue" },
                totalAgentCommission: { $sum: "$agentCommission" },
                transactionCount: { $sum: 1 },
            },
        },
    ]);
    const [totalTransaction, totalAddTransaction, totalWithdrawTransaction, totalSendTransaction, newTransactionInLast7Days, newTransactionInLast30Days, totalFee, totalCommission, totalRevenue,] = yield Promise.all([
        totalTransactionPromise,
        totalAddTransactionPromise,
        totalWithdrawTransactionPromise,
        totalSendTransactionPromise,
        newTransactionInLast7DaysPromise,
        newTransactionInLast30DaysPromise,
        totalFeePromise,
        totalCommissionPromise,
        totalRevenuePromise,
    ]);
    return {
        totalTransaction,
        totalAddTransaction,
        totalWithdrawTransaction,
        totalSendTransaction,
        newTransactionInLast7Days,
        newTransactionInLast30Days,
        totalFee,
        totalCommission,
        totalRevenue,
    };
});
const getAgentTransactionStats = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const currentBalancePromise = wallet_model_1.Wallet.findOne({ phone }, { balance: 1, _id: 0 });
    // const agentStatsPromise = Transaction.aggregate([
    //   {
    //     $match: {
    //       status: Transaction_Status.COMPLETE,
    //       toUser: phone,
    //       type: TransactionType.WITHDRAW,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalWithdrawn: { $sum: "$amount" },
    //       totalCommissionEarned: {
    //         $sum: {
    //           $multiply: [{ $ifNull: ["$fee", 0] }, 0.2],
    //         },
    //       },
    //       withdrawalCount: { $sum: 1 },
    //     },
    //   },
    // ]);
    const agentTransactionPromise = transaction_model_1.Transaction.aggregate([
        { $match: { status: transaction_interface_1.Transaction_Status.COMPLETE } },
        {
            $facet: {
                // All Time Transactions
                allTransactions: [
                    { $match: { $or: [{ fromUser: phone }, { toUser: phone }] } },
                    {
                        $group: {
                            _id: null,
                            totalTransaction: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // Last 7 days transactions
                last7DaysTransaction: [
                    {
                        $match: {
                            $or: [{ fromUser: phone }, { toUser: phone }],
                            createdAt: { $gte: sevenDaysAgo },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalTransaction: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // Last 30 days transactions
                last30DaysTransaction: [
                    {
                        $match: {
                            $or: [{ fromUser: phone }, { toUser: phone }],
                            createdAt: { $gte: thirtyDaysAgo },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalTransaction: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // As Withdraw (agent receiving money from users) CashOut
                receivedMoney: [
                    { $match: { toUser: phone, type: transaction_interface_1.TransactionType.WITHDRAW } },
                    {
                        $group: {
                            _id: null,
                            totalReceived: { $sum: "$amount" },
                            totalCommissionEarned: {
                                $sum: {
                                    $multiply: [{ $ifNull: ["$fee", 0] }, 0.2],
                                },
                            },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // As Sender (agent transfer money to users) CashIn
                addMoney: [
                    { $match: { fromUser: phone, type: transaction_interface_1.TransactionType.ADD } },
                    {
                        $group: {
                            _id: null,
                            totalCashIn: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                allTransactions: { $arrayElemAt: ["$allTransactions", 0] },
                last7DaysTransaction: { $arrayElemAt: ["$last7Days", 0] },
                last30DaysTransaction: { $arrayElemAt: ["$last30Days", 0] },
                receivedMoney: { $arrayElemAt: ["$receivedMoney", 0] },
                addMoney: { $arrayElemAt: ["$addMoney", 0] },
            },
        },
    ]);
    const [currentBalance, agentTransaction] = yield Promise.all([
        currentBalancePromise,
        agentTransactionPromise,
    ]);
    return {
        currentBalance,
        agentTransaction,
    };
});
const getUserTransactionStats = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const currentBalancePromise = wallet_model_1.Wallet.findOne({ phone }, { balance: 1, _id: 0 });
    const userTransactionPromise = transaction_model_1.Transaction.aggregate([
        { $match: { status: transaction_interface_1.Transaction_Status.COMPLETE } },
        {
            $facet: {
                // Total Transaction
                allTransactions: [
                    {
                        $match: {
                            $or: [{ fromUser: phone }, { toUser: phone }],
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalTransaction: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // As Sender (user sending money to other users)
                sendMoney: [
                    { $match: { fromUser: phone, type: transaction_interface_1.TransactionType.SEND } },
                    {
                        $group: {
                            _id: null,
                            totalSent: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // As Receiver (user receiving money from other users)
                receivedMoney: [
                    { $match: { toUser: phone, type: transaction_interface_1.TransactionType.SEND } },
                    {
                        $group: {
                            _id: null,
                            totalReceived: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                // As Receiver from agent (user receiving money when agent add money)
                addMoney: [
                    { $match: { toUser: phone, type: transaction_interface_1.TransactionType.ADD } },
                    {
                        $group: {
                            _id: null,
                            totalCashIn: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
                withDraw: [
                    { $match: { fromUser: phone, type: transaction_interface_1.TransactionType.WITHDRAW } },
                    {
                        $group: {
                            _id: null,
                            totalCashOut: { $sum: "$amount" },
                            count: { $sum: 1 },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                allTransactions: { $arrayElemAt: ["$allTransactions", 0] },
                sendMoney: { $arrayElemAt: ["$sendMoney", 0] },
                receivedMoney: { $arrayElemAt: ["$receivedMoney", 0] },
                addMoney: { $arrayElemAt: ["$addMoney", 0] },
                withDraw: { $arrayElemAt: ["$withDraw", 0] },
            },
        },
    ]);
    const [userTransaction, currentBalance] = yield Promise.all([
        userTransactionPromise,
        currentBalancePromise,
    ]);
    return { currentBalance, userTransaction };
});
exports.statsServices = {
    getUserStats,
    getAllTransactionStats,
    getAgentTransactionStats,
    getUserTransactionStats,
};
