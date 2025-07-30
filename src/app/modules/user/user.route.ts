import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/create-user", userControllers.createUser);
router.get("/", userControllers.getAllUsers);
router.patch("/:id", userControllers.updatedUser);
router.delete("/:id", userControllers.deletedUser);

export const userRoutes = router;
