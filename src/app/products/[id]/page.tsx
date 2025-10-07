"use client";

import { useDelete, useOne } from "@refinedev/core";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProductShowPage() {
  const params = useParams();
  const router = useRouter();
  const { query } = useOne({
    resource: "products",
    id: params.id as string,
  });

  const { mutate: deleteProduct } = useDelete();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(
        {
          resource: "products",
          id: params.id as string,
        },
        {
          onSuccess: () => {
            router.push("/products");
          },
        },
      );
    }
  };

  if (query.isLoading) {
    return <div className="p-8">Loading product...</div>;
  }

  const product = query.data?.data;

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/products" className="text-primary hover:underline">
          ← Back to Products
        </Link>
      </div>

      <div className="max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <div className="flex gap-2">
            <Link
              href={`/products/${params.id}/edit`}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-destructive/30 text-destructive rounded-md hover:bg-destructive/10"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Description
            </div>
            <p className="text-lg">{product?.description}</p>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Price
            </div>
            <p className="text-2xl font-bold">${product?.price}</p>
          </div>

          {product?.material && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Material
              </div>
              <p className="text-lg">{product.material}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
