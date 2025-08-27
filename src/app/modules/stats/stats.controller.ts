import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { statsServices } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

const getUserStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await statsServices.getUserStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User stats fetched successfully",
    data: stats,
  });
});

const getAllTransactionStats = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await statsServices.getAllTransactionStats();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Transactions stats fetched successfully",
      data: stats,
    });
  }
);

const getAgentTransactionStats = catchAsync(
  async (req: Request, res: Response) => {
    const verifiedToken = req.user as JwtPayload;
    const stats = await statsServices.getAgentTransactionStats(
      verifiedToken.phone
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transactions stats fetched successfully",
      data: stats,
    });
  }
);

const getUserTransactionStats = catchAsync(
  async (req: Request, res: Response) => {
    const verifiedToken = req.user as JwtPayload;
    const stats = await statsServices.getUserTransactionStats(
      verifiedToken.phone
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Transactions stats fetched successfully",
      data: stats,
    });
  }
);

export const statsControllers = {
  getUserStats,
  getAllTransactionStats,
  getAgentTransactionStats,
  getUserTransactionStats,
};
