import { model, Schema } from "mongoose";
import { IFeedback } from "./feedback.interface";

const feedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Feedback = model<IFeedback>("Feedback", feedbackSchema);
