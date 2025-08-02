import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.createUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `User Created Successfully`,
    data: user,
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

const updatedUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const payload = req.body;
  const user = await userServices.updateUser(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Updated Successfully.",
    data: user,
  });
});

const deletedUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userServices.deleteUser(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User Deleted Successfully.",
    data: user,
  });
});

export const userControllers = {
  createUser,
  getAllUsers,
  updatedUser,
  deletedUser,
};
