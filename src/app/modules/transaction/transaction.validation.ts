import z from "zod";

export const transactionZodSchema = z.object({
  transactionId: z.string(),
  type: z.string(),
  amount: z.number(),
  status: z.string(),
  fromUser: z.string(),
  toUser: z.string(),
  note: z.string(),
});
