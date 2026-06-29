"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateCartItem, removeCartItem } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";
import type { CarritoResponse } from "@/lib/api/types";

interface CartViewProps {
  cart: CarritoResponse;
  onChange: (c: CarritoResponse) => void;
}

export function CartView({ cart, onChange }: CartViewProps) {
  async function handleUpdate(itemId: number, cantidad: number) {
    try {
      const updated = await updateCartItem(itemId, cantidad);
      onChange(updated);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.payload.message : "Failed to update item";
      toast.error(msg);
    }
  }

  async function handleRemove(itemId: number) {
    try {
      const updated = await removeCartItem(itemId);
      onChange(updated);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.payload.message : "Failed to remove item";
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 border rounded-lg p-4"
        >
          <div className="relative h-16 w-16 shrink-0 bg-muted rounded overflow-hidden">
            {item.productoImagenUrl ? (
              <Image
                src={item.productoImagenUrl}
                alt={item.productoNombre}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.productoNombre}</p>
            <p className="text-sm text-muted-foreground">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(item.precioUnitario)}{" "}
              each
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdate(item.id, item.cantidad - 1)}
              disabled={item.cantidad <= 1}
            >
              <Minus className="h-3 w-3" strokeWidth={1.75} />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.cantidad}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleUpdate(item.id, item.cantidad + 1)}
            >
              <Plus className="h-3 w-3" strokeWidth={1.75} />
            </Button>
          </div>
          <div className="text-right min-w-[80px]">
            <p className="font-semibold">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(item.subtotal)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => handleRemove(item.id)}
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
          </Button>
        </div>
      ))}
      <div className="border-t pt-4 text-right">
        <p className="text-lg font-semibold">
          Total:{" "}
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(cart.totalCalculado)}
        </p>
      </div>
    </div>
  );
}
