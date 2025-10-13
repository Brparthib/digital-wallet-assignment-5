import { model, Schema } from "mongoose";
import {
  Approval,
  IAuthProvider,
  IUser,
  Role,
  User_Status,
} from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String },
    email: { type: String },
    address: { type: String },
    picture: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    approval: {
      type: String,
      enum: Object.values(Approval),
      default: Approval.SUSPEND,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(User_Status),
      default: User_Status.ACTIVE,
    },
    auths: [authProviderSchema],
    claimRole: {
      type: String,
    },
    feedback: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

export const User = model<IUser>("User", userSchema);
