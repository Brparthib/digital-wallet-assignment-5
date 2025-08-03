import { User_Status } from "./../modules/user/user.interface";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../configs/envCon";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    phone: user.phone,
    role: user.role,
    approval: user.approval,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExists = await User.findOne({
    phone: verifiedRefreshToken.phone,
  });
  if (!isUserExists) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist!!");
  }

  if (
    isUserExists.status === User_Status.BLOCKED ||
    isUserExists.status === User_Status.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExists.status}!!`
    );
  }

  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is deleted!!");
  }

  const jwtPayload = {
    userId: isUserExists._id,
    phone: isUserExists.phone,
    role: isUserExists.role,
    approval: isUserExists.approval,
  };

  const newAccessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );

  return newAccessToken;
};
