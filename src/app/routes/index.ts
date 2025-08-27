import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { walletRoutes } from "../modules/wallet/wallet.route";
import { authRoutes } from "../modules/auth/auth.route";
import { transactionRoutes } from "../modules/transaction/transaction.route";
import { statsRoutes } from "../modules/stats/stats.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/wallet",
    route: walletRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
  {
    path: "/stats",
    route: statsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
