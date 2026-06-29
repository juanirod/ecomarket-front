import type { ProductoResponse } from "@/lib/api/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductoResponse[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} producto={p} />
      ))}
    </div>
  );
}
