import { Router } from "express";
import { walletControllers } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/send-money", checkAuth(Role.USER), walletControllers.sendMoney);
router.post("/cash-in", checkAuth(Role.AGENT), walletControllers.cashIn);
router.post("/cash-out", checkAuth(Role.USER), walletControllers.cashOut);
router.get("/", checkAuth(Role.ADMIN), walletControllers.getAllWallets);
router.get(
  "/my-wallet",
  checkAuth(...Object.values(Role)),
  walletControllers.getMyWallet
);
router.patch("/:phone", checkAuth(Role.ADMIN), walletControllers.updateWallet);
// router.get("/:phone", checkAuth(Role.ADMIN), walletControllers.getUserWallet);
// router.patch(
//   "/:phone",
//   checkAuth(Role.ADMIN),
//   walletControllers.toggleWalletStatus
// );

export const walletRoutes = router;
