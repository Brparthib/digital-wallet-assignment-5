import { Router } from "express";
import { walletControllers } from "./wallet.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createWalletZodSchema } from "./wallet.validation";

const router = Router();

router.post(
  "/create-wallet",
  validateRequest(createWalletZodSchema),
  walletControllers.createWallet
);
router.get("/", walletControllers.getAllWallets);
router.get("/:id", walletControllers.getAllWalletByUser);
router.patch(
    "/:id",
    walletControllers.updateBalance
);

export const walletRoutes = router;
