import * as z from "zod";
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone number is required"),
  // .regex(
  //   /^([^\s@]+@[^\s@]+\.[^\s@]+|[0-9]{11})$/,
  //   "Invalid email or phone number"
  // ),
  password: z
    .string()
    .min(8, "Password must be 8-25 characters")
    .max(25, "Password must be 8-25 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
