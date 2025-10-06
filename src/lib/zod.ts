import { z } from "zod";

/**
 * Common Zod validation patterns and utilities
 */

// Email validation
export const emailSchema = z.email();

// Password validation (min 8 chars, at least one letter and number)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

// URL validation
export const urlSchema = z.url();

// Date string validation
export const dateStringSchema = z.iso.datetime();

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ID validation (UUID)
export const uuidSchema = z.uuid();

// ID validation (numeric)
export const numericIdSchema = z.coerce.number().int().positive();

/**
 * Utility to create a success/error response schema
 */
export const createResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion("success", [
    z.object({
      success: z.literal(true),
      data: dataSchema,
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ]);

/**
 * Helper to safely parse data with error handling
 */
export const safeParse = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): { success: true; data: z.infer<T> } | { success: false; error: string } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: result.error.issues[0]?.message ?? "Validation failed",
  };
};

/**
 * Type helper to infer Zod schema type
 */
export type Infer<T extends z.ZodTypeAny> = z.infer<T>;
