"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRoutes = void 0;
const express_1 = require("express");
const feedback_controller_1 = require("./feedback.controller");
const router = (0, express_1.Router)();
router.post("/", feedback_controller_1.feedbackControllers.giveFeedback);
exports.feedbackRoutes = router;
