import z from "zod";

export const createWalletZodSchema = z.object({
  userId: z.string(),
});
