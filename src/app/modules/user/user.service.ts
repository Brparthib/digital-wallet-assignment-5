import { envVars } from "../../configs/envCon";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExists = await User.findOne({ email });
  if (isUserExists) {
    throw new Error("User Already Exists!!");
  }

  const hashedPassword = await bcrypt.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND) | 10
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();
  if (!users) {
    throw new Error("Users Not Found!!");
  }

  const totalUser = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUser,
    },
  };
};

const updateUser = async (userId: string, payload: Partial<IUser>) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password as string,
      Number(envVars.BCRYPT_SALT_ROUND) | 10
    );
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

const deleteUser = async (userId: string) => {
  const isUserExists = await User.findById(userId);
  if (!isUserExists) {
    throw new Error("User Does Not Exists!!");
  }

  const deletedUser = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true }
  );

  return deletedUser;
};

export const userServices = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
