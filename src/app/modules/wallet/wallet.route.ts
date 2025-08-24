import { Router } from "express";
import { walletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/send-money", checkAuth(Role.USER), walletControllers.sendMoney);
router.post("/cash-in", checkAuth(Role.AGENT), walletControllers.cashIn);
router.post("/cash-out", checkAuth(Role.USER), walletControllers.cashOut);
router.get(
  "/all-wallet",
  checkAuth(Role.ADMIN),
  walletControllers.getAllWallets
);
router.get(
  "/my-wallet",
  checkAuth(...Object.values(Role)),
  walletControllers.getMyWallet
);
router.patch("/:id", checkAuth(Role.ADMIN), walletControllers.updateWallet);

export const walletRoutes = router;
