import { Router } from "express";
import { transactionControllers } from "./transaction.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.get(
  "/all-transaction",
  checkAuth(Role.ADMIN),
  transactionControllers.getAllTransactions
);
router.get(
  "/my-transaction",
  checkAuth(...Object.values(Role)),
  transactionControllers.getTransactionsById
);

export const transactionRoutes = router;
