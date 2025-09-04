/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../configs/envCon";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../modules/wallet/wallet.model";

export const seedDummyUser = async () => {
  try {
    const isAdminExists = await User.findOne({
      phone: envVars.USER_PHONE,
    });
    if (isAdminExists) {
      console.log("User Already Exists!!");
      return;
    }

    console.log("Trying To Create Dummy User...");

    const hashedPassword = await bcrypt.hash(
      envVars.USER_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND) | 10
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.USER_PHONE,
    };

    const payload: IUser = {
      name: "Dummy User",
      phone: envVars.USER_PHONE,
      password: hashedPassword,
      role: Role.USER,
      isVerified: true,
      auths: [authProvider],
    };

    const user = await User.create(payload);

    const wallet = await Wallet.create({
      userId: user._id,
      phone: user.phone,
      balance: Number(envVars.MINIMUM_BALANCE),
    });

    console.log(`Dummy User created successfully with ${wallet.balance} Tk wallet.`);
    console.log({ user, wallet });
  } catch (error: any) {
    console.log(error);
  }
};
