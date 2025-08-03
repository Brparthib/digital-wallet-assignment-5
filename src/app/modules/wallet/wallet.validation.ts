import z from "zod";

export const createWalletZodSchema = z.object({
  userId: z.string(),
  phone: z
    .string({ error: "Phone number must be string." })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    }),
});

export const updateWalletZodSchema = z.object({
  status: z.string().optional(),
});
