/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../configs/envCon";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });
    if (isAdminExists) {
      console.log("Admin Already Exists!!");
      return;
    }

    console.log("Trying To Create Admin...");

    const hashedPassword = await bcrypt.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND) | 10
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      email: envVars.ADMIN_EMAIL,
      role: Role.ADMIN,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const admin = await User.create(payload);
    console.log("Admin Created Successfully..!");
    console.log(admin);
  } catch (error: any) {
    console.log(error);
  }
};
