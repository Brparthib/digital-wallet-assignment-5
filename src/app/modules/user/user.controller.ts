import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `User created successfully with ${result.wallet.balance} BDT wallet.`,
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userServices.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users Retrieved Successfully.",
    meta: users.meta,
    data: users.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.getSingleUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users Retrieved Successfully.",
    data: user,
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const verifiedToken = req.user;
  const result = await userServices.updateUser(userId, payload, verifiedToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message ? result.message : "User Updated Successfully.",
    data: result.updatedUser,
  });
});

const deletedUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.deleteUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Deleted Successfully.",
    data: result,
  });
});

export const userControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deletedUser,
};
