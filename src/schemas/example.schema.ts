import { z } from "zod";
import { emailSchema, passwordSchema } from "@/lib/zod";

/**
 * Example user schema
 */
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  age: z.number().int().positive().optional(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

/**
 * Example authentication schemas
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(1, "Name is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
