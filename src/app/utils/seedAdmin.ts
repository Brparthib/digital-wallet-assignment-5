/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../configs/envCon";
import { Approval, IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../modules/wallet/wallet.model";

export const seedAdmin = async () => {
  try {
    const isAdminExists = await User.findOne({
      phone: envVars.ADMIN_PHONE,
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
      providerId: envVars.ADMIN_PHONE,
    };

    const payload: IUser = {
      name: "Admin",
      phone: envVars.ADMIN_PHONE,
      password: hashedPassword,
      role: Role.ADMIN,
      approval: Approval.APPROVED,
      isVerified: true,
      auths: [authProvider],
    };

    const admin = await User.create(payload);

    const wallet = await Wallet.create({
      userId: admin._id,
      phone: admin.phone,
      balance: Number(envVars.MINIMUM_BALANCE),
    });

    console.log(`Admin created successfully with ${wallet.balance} Tk wallet.`);
    console.log({ admin, wallet });
  } catch (error: any) {
    console.log(error);
  }
};
