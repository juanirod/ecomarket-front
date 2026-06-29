"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { ProductTable } from "@/components/admin/ProductTable";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductos, createProducto } from "@/lib/api/endpoints";
import type { ProductoResponse } from "@/lib/api/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const page = await getProductos(0, 100);
      setProducts(page.content);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleCreate(data: Omit<ProductoResponse, "id" | "fechaActualizacion">) {
    await createProducto(data);
    toast.success("Product created");
    setCreating(false);
    fetchProducts();
  }

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold">Products</h1>
        <Button onClick={() => setCreating(true)}>
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.75} />
          New product
        </Button>
      </div>

      <ProductTable products={products} onMutated={fetchProducts} />

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleCreate} submitLabel="Create product" />
        </DialogContent>
      </Dialog>
    </>
  );
}
