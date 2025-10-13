"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const auth_route_1 = require("../modules/auth/auth.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const stats_route_1 = require("../modules/stats/stats.route");
const feedback_route_1 = require("../modules/feedback/feedback.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/wallet",
        route: wallet_route_1.walletRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/transaction",
        route: transaction_route_1.transactionRoutes,
    },
    {
        path: "/stats",
        route: stats_route_1.statsRoutes,
    },
    {
        path: "/feedback",
        route: feedback_route_1.feedbackRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
