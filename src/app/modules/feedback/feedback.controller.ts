import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { feedbackServices } from "./feedback.service";

const giveFeedback = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await feedbackServices.giveFeedback(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Feedback Given Successfully",
    data: result,
  });
});

export const feedbackControllers = {
  giveFeedback,
};
