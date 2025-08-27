import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statsControllers } from "./stats.controller";

const router = Router();

router.get("/user", checkAuth(Role.ADMIN), statsControllers.getUserStats);
router.get(
  "/all-transactions",
  checkAuth(Role.ADMIN),
  statsControllers.getAllTransactionStats
);
router.get(
  "/agent-transactions",
  checkAuth(Role.AGENT),
  statsControllers.getAgentTransactionStats
);
router.get(
  "/user-transactions",
  checkAuth(Role.USER),
  statsControllers.getUserTransactionStats
);

export const statsRoutes = router;
