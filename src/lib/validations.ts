import * as z from "zod";

// Base password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    "Password must contain at least one letter and one number"
  );

// Email validation schema
const emailSchema = z.string().email("Please enter a valid email address");

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Registration form schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Combined form schema for login/register (used in form.tsx)
export const formSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

// Password confirmation validation helper
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};
