import { z } from "zod";
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Username is required"),
  // .regex(
  //   /^([^\s@]+@[^\s@]+\.[^\s@]+|[0-9]{11})$/,
  //   "Invalid email or phone number"
  // ),
  password: z
    .string()
    .min(7, "Password must be 7-25 characters")
    .max(25, "Password must be 8-25 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
