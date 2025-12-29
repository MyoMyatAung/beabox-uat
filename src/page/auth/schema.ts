import { z } from "zod";
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(7, "Password must be 7-25 characters")
    .max(25, "Password must be 8-25 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
