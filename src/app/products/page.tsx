"use client";

import { useList } from "@refinedev/core";
import Link from "next/link";
import type { Product } from "@/schemas/product.schema";

export default function ProductsListPage() {
  const { query } = useList<Product>({
    resource: "products",
  });

  if (query.isLoading) {
    return <div className="p-8">Loading products...</div>;
  }

  return (
    <div className="p-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/products/create"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Create Product
        </Link>
      </div>

      <div className="border rounded-lg p-4 flex-1 overflow-y-auto min-h-0">
        <div className="grid gap-4">
          {query.data?.data?.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-muted-foreground mb-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold">${product.price}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
                  >
                    View
                  </Link>
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
