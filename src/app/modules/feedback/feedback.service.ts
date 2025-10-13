import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { IFeedback } from "./feedback.interface";
import { Feedback } from "./feedback.model";

const giveFeedback = async (payload: IFeedback) => {
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!");
  }

  const feedback = await Feedback.findOne({ userId: payload.userId });
  if (feedback) {
    return;
  }

  const result = await Feedback.create(payload);

  user.feedback = true;
  user.save();

  return result;
};

export const feedbackServices = {
  giveFeedback,
};
