import {
  Transaction_Status,
  TransactionType,
} from "../transaction/transaction.interface";
import { Transaction } from "../transaction/transaction.model";
import { User_Status } from "../user/user.interface";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";

const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = await User.countDocuments();
  const totalActiveUsersPromise = User.countDocuments({
    status: User_Status.ACTIVE,
  });
  const totalInActiveUsersPromise = User.countDocuments({
    status: User_Status.INACTIVE,
  });
  const totalBlockedUsersPromise = User.countDocuments({
    status: User_Status.BLOCKED,
  });

  const newUsersInLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });

  const newUsersInLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const usersByRolePromise = User.aggregate([
    // stage-1: Grouping users by role and count total users in each role
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    totalActiveUsers,
    totalInActiveUsers,
    totalBlockedUsers,
    newUsersInLast7Days,
    newUsersInLast30Days,
    usersByRole,
  ] = await Promise.all([
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
};

const getAllTransactionStats = async () => {
  const totalTransactionPromise = Transaction.countDocuments();
  const totalAddTransactionPromise = Transaction.countDocuments({
    type: TransactionType.ADD,
  });
  const totalWithdrawTransactionPromise = Transaction.countDocuments({
    type: TransactionType.WITHDRAW,
  });
  const totalSendTransactionPromise = Transaction.countDocuments({
    type: TransactionType.SEND,
  });

  const newTransactionInLast7DaysPromise = Transaction.countDocuments({
    createdAt: { $gte: sevenDaysAgo },
  });
  const newTransactionInLast30DaysPromise = Transaction.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  const totalFeePromise = Transaction.aggregate([
    {
      $group: {
        _id: "$fee",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalCommissionPromise = Transaction.aggregate([
    {
      $group: {
        _id: "$commission",
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRevenuePromise = Transaction.aggregate([
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

  const [
    totalTransaction,
    totalAddTransaction,
    totalWithdrawTransaction,
    totalSendTransaction,
    newTransactionInLast7Days,
    newTransactionInLast30Days,
    totalFee,
    totalCommission,
    totalRevenue,
  ] = await Promise.all([
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
};

const getAgentTransactionStats = async (phone: string) => {
  const currentBalancePromise = Wallet.findOne(
    { phone },
    { balance: 1, _id: 0 }
  );

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

  const agentTransactionPromise = Transaction.aggregate([
    { $match: { status: Transaction_Status.COMPLETE } },
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
          { $match: { toUser: phone, type: TransactionType.WITHDRAW } },
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
          { $match: { fromUser: phone, type: TransactionType.ADD } },
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

  const [currentBalance, agentTransaction] = await Promise.all([
    currentBalancePromise,
    agentTransactionPromise,
  ]);

  return {
    currentBalance,
    agentTransaction,
  };
};

const getUserTransactionStats = async (phone: string) => {
  const currentBalancePromise = Wallet.findOne(
    { phone },
    { balance: 1, _id: 0 }
  );

  const userTransactionPromise = Transaction.aggregate([
    { $match: { status: Transaction_Status.COMPLETE } },
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
          { $match: { fromUser: phone, type: TransactionType.SEND } },
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
          { $match: { toUser: phone, type: TransactionType.SEND } },
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
          { $match: { toUser: phone, type: TransactionType.ADD } },
          {
            $group: {
              _id: null,
              totalCashIn: { $sum: "$amount" },
              count: { $sum: 1 },
            },
          },
        ],

        withDraw: [
          { $match: { fromUser: phone, type: TransactionType.WITHDRAW } },
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

  const [userTransaction, currentBalance] = await Promise.all([
    userTransactionPromise,
    currentBalancePromise,
  ]);

  return { currentBalance, userTransaction };
};

export const statsServices = {
  getUserStats,
  getAllTransactionStats,
  getAgentTransactionStats,
  getUserTransactionStats,
};
