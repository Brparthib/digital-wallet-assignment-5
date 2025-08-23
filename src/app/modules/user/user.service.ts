import httpStatus from "http-status-codes";
import { envVars } from "../../configs/envCon";
import AppError from "../../errorHelpers/AppError";
import { Approval, IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../wallet/wallet.model";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  const { phone, role, password, ...rest } = payload;

  const isUserExists = await User.findOne({ phone });
  if (isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exists!!");
  }

  if (role === Role.ADMIN) {
    throw new AppError(httpStatus.BAD_REQUEST, "You are unauthorized!!");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND) | 10
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: phone as string,
  };

  const user = await User.create({
    phone,
    password: hashedPassword,
    role: role,
    auths: [authProvider],
    ...rest,
  });

  const wallet = await Wallet.create({
    userId: user._id,
    phone: phone,
    balance: Number(envVars.MINIMUM_BALANCE),
  });

  return { user, wallet };
};

const getAllUsers = async () => {
  const users = await User.find();
  if (!users) {
    throw new AppError(httpStatus.NOT_FOUND, "Users Not Found!!");
  }

  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

const getMyProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User Not Found!!");
  }

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password as string,
      Number(envVars.BCRYPT_SALT_ROUND) | 10
    );
  }

  if (payload.approval && decodedToken.role !== Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are unauthorized!!");
  }

  if (payload.role === Role.ADMIN && decodedToken.role !== Role.ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "You are unauthorized!!");
  }

  let message = "";
  if (payload.role === Role.AGENT && decodedToken.role !== Role.USER) {
    message =
      "You have claimed to be an agent. Please wait for admin approval. You can continue using the wallet until you're approved.";
  }

  if (
    payload.role === Role.AGENT &&
    decodedToken.role !== Role.AGENT &&
    decodedToken.approval === Approval.SUSPEND
  ) {
    message =
      "You have claimed to be an agent. Please wait for admin approval. You can continue using the wallet until you're approved.";
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return { updatedUser, message };
};

const deleteUser = async (userId: string) => {
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Does Not Exists!!");
  }

  await User.findByIdAndUpdate(userId, { isDeleted: true });

  await Wallet.findByIdAndUpdate(userId, { isDeleted: true });

  return null;
};

export const userServices = {
  createUser,
  getAllUsers,
  getMyProfile,
  updateUser,
  deleteUser,
};
