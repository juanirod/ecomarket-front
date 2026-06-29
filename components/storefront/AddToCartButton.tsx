"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { CarritoResponse } from "@/lib/api/types";

interface AddToCartButtonProps {
  productoId: number;
  stock: number;
  onAddToCart?: (cart: CarritoResponse) => void;
}

export function AddToCartButton({
  productoId,
  stock,
  onAddToCart,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    try {
      const cart = await apiFetch<CarritoResponse>("/carrito/items", {
        method: "POST",
        body: JSON.stringify({ productoId, cantidad: 1 }),
        withSession: true,
      });
      onAddToCart?.(cart);
      toast.success("Added to cart");
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.payload.message : "Failed to add item";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleAdd}
      disabled={stock === 0 || loading}
      className="w-full"
    >
      <ShoppingCart className="mr-2 h-4 w-4" strokeWidth={1.75} />
      {stock === 0 ? "Out of stock" : loading ? "Adding…" : "Add to cart"}
    </Button>
  );
}
