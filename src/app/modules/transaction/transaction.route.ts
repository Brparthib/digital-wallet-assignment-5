import { Router } from "express";
import { transactionControllers } from "./transaction.controllers";

const router = Router();

router.post('/make-transaction', transactionControllers.makeTransaction);


export const transactionRoutes = router;