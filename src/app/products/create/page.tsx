"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import Link from "next/link";
import { productSchema } from "@/schemas/product.schema";

export default function ProductCreatePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    refineCore: { onFinish },
  } = useForm({
    resolver: zodResolver(productSchema),
    refineCoreProps: {
      resource: "products",
      action: "create",
      redirect: "show",
    },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/products" className="text-primary hover:underline">
          ← Back to Products
        </Link>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Create Product</h1>

        <form onSubmit={handleSubmit(onFinish)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Product name"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-destructive mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="material"
              className="block text-sm font-medium mb-2"
            >
              Material (optional)
            </label>
            <input
              id="material"
              {...register("material")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Product material"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Create Product
            </button>
            <Link
              href="/products"
              className="px-4 py-2 border rounded-md hover:bg-accent inline-flex items-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
