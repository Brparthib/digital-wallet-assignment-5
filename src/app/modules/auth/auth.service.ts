/* eslint-disable @typescript-eslint/no-non-null-assertion */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcryptjs";
import { createNewAccessToken, createUserTokens } from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../configs/envCon";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { phone, password } = payload;

  const isUserExists = await User.findOne({ phone });
  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User Doesn't Exists!!");
  }

  const isPasswordMatched = await bcrypt.compare(
    password as string,
    isUserExists.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!!");
  }

  const userTokens = createUserTokens(isUserExists);

  delete isUserExists.toObject().password;

  return {
    accessToken: userTokens.accessToken,
    refreshToken: userTokens.refreshToken,
    user: isUserExists,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessToken(refreshToken);

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  decodedToken: JwtPayload,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(decodedToken.userId);

  const validPassword = await bcrypt.compare(
    oldPassword,
    user!.password as string
  );
  if (!validPassword) {
    throw new AppError(httpStatus.FORBIDDEN, "Old password does not match!!");
  }

  user!.password = await bcrypt.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND) | 10
  );

  user!.save();
};

export const authServices = {
  credentialLogin,
  getNewAccessToken,
  resetPassword,
};
