import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.createUser(req.body);

    res.status(httpStatus.CREATED).send({
      success: true,
      message: "User Created Successfully.",
      data: user,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "Failed to create user!!",
      data: null,
      error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsers();

    res.status(httpStatus.OK).send({
      success: true,
      message: "Users Retrieved Successfully.",
      meta: users.meta,
      data: users.data,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "Failed to retrieved users!!",
      data: null,
      error,
    });
  }
};

const updatedUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const payload = req.body;
    const user = await userServices.updateUser(userId, payload);

    res.status(httpStatus.OK).send({
      success: true,
      message: "User Updated Successfully.",
      data: user,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "Failed to update user!!",
      data: null,
      error,
    });
  }
};

const deletedUser = async (req: Request, res: Response) => {
  try {
    const user = await userServices.deleteUser(req.params.id);

    res.status(httpStatus.CREATED).send({
      success: true,
      message: "User Deleted Successfully.",
      data: user,
    });
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: "Failed to delete user!!",
      data: null,
      error,
    });
  }
};

export const userControllers = {
  createUser,
  getAllUsers,
  updatedUser,
  deletedUser,
};
