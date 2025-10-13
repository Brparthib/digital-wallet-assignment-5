/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { envVars } from "../configs/envCon";
import {
  Approval,
  IAuthProvider,
  IUser,
  Role,
} from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";
import { Wallet } from "../modules/wallet/wallet.model";

export const seedDummyAgent = async () => {
  try {
    const isAdminExists = await User.findOne({
      phone: envVars.AGENT_PHONE,
    });
    if (isAdminExists) {
      console.log("Agent Already Exists!!");
      return;
    }

    console.log("Trying To Create Dummy Agent...");

    const hashedPassword = await bcrypt.hash(
      envVars.AGENT_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND) | 10
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.AGENT_PHONE,
    };

    const payload: IUser = {
      name: "Agent",
      phone: envVars.AGENT_PHONE,
      password: hashedPassword,
      role: Role.AGENT,
      approval: Approval.APPROVED,
      isVerified: true,
      auths: [authProvider],
    };

    const agent = await User.create(payload);

    const wallet = await Wallet.create({
      userId: agent._id,
      phone: agent.phone,
      balance: Number(envVars.MINIMUM_BALANCE),
    });

    console.log(
      `Agent created successfully with ${wallet.balance} Tk wallet.`
    );
    console.log({ agent, wallet });
  } catch (error: any) {
    console.log(error);
  }
};
