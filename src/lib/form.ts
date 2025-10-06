/**
 * Common form field validation messages
 */
export const fieldValidation = {
  required: "This field is required",
  email: "Please enter a valid email address",
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  pattern: "Invalid format",
} as const;
