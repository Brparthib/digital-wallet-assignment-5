import { Router } from "express";
import { userControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/create-user",
  validateRequest(createUserZodSchema),
  userControllers.createUser
);
router.get("/", userControllers.getAllUsers);
router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  userControllers.updatedUser
);
router.delete("/:id", userControllers.deletedUser);

export const userRoutes = router;
