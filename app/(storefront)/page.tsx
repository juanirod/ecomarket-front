import { Suspense } from "react";
import { PackageOpen } from "lucide-react";
import { getProductos } from "@/lib/api/endpoints";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { PaginationLinks } from "@/components/shared/PaginationLinks";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

async function CatalogContent({ page }: { page: number }) {
  const data = await getProductos(page);
  const active = data.content.filter((p) => p.activo);

  if (active.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="No products available"
        description="Check back later for new arrivals."
      />
    );
  }

  return (
    <>
      <ProductGrid products={active} />
      <PaginationLinks
        page={data.number}
        totalPages={data.totalPages}
        basePath="/"
      />
    </>
  );
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(0, parseInt(params.page ?? "0", 10) || 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-semibold mb-8">Our Products</h1>
      <Suspense fallback={<LoadingSkeleton rows={8} columns={4} />}>
        <CatalogContent page={page} />
      </Suspense>
    </div>
  );
}
