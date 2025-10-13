import { Router } from "express";
import { feedbackControllers } from "./feedback.controller";

const router = Router();

router.post("/", feedbackControllers.giveFeedback);

export const feedbackRoutes = router;
