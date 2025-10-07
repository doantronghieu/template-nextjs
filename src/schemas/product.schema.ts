import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  material: z.string().optional(),
});

export type Product = z.infer<typeof productSchema> & {
  id: string;
};
