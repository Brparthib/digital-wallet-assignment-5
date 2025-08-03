import { randomBytes } from "crypto";

export const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const randomHex = randomBytes(4).toString("hex");
  return `Tran-${timestamp}-${randomHex}`;
};
