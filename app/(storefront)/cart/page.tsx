"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { CartView } from "@/components/storefront/CartView";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";
import { getCarrito } from "@/lib/api/endpoints";
import { resetSession } from "@/lib/session";
import { useSetCartCount } from "@/lib/cart-count-context";
import type { CarritoResponse, OrdenResponse } from "@/lib/api/types";

export default function CartPage() {
  const [cart, setCart] = useState<CarritoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrdenResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const setCount = useSetCartCount();

  useEffect(() => {
    getCarrito()
      .then((c) => {
        setCart(c);
        setCount(c.items.length);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [setCount]);

  useEffect(() => {
    if (placedOrder) {
      resetSession();
      setCount(0);
    }
  }, [placedOrder, setCount]);

  function handleCartChange(updated: CarritoResponse) {
    setCart(updated);
    setCount(updated.items.length);
  }

  async function handleCopy() {
    if (!placedOrder?.trackingNumber) return;
    await navigator.clipboard.writeText(placedOrder.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <ErrorState error={error} />
      </div>
    );
  }

  if (placedOrder) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-center">
        <h1 className="font-display text-3xl font-semibold mb-4">Order Placed!</h1>
        <p className="text-muted-foreground mb-8">
          Your order has been confirmed. Save your tracking number to check its status later.
        </p>
        <div className="rounded-lg border bg-card p-6 mb-8">
          <p className="text-sm text-muted-foreground mb-2">Tracking number</p>
          <p className="font-mono text-2xl font-bold tracking-widest">
            {placedOrder.trackingNumber ?? "—"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" onClick={handleCopy} disabled={!placedOrder.trackingNumber}>
            {copied ? "Copied!" : "Copy tracking number"}
          </Button>
          <Button asChild>
            <Link href="/tracking">Track your order</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-semibold mb-8">Your Cart</h1>
      {isEmpty ? (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some products to get started."
          action={{ label: "Browse catalog", href: "/" }}
        />
      ) : (
        <>
          <CartView cart={cart!} onChange={handleCartChange} />
          <div className="mt-8 pt-8 border-t">
            <h2 className="font-display text-xl font-semibold mb-6">Checkout</h2>
            <CheckoutForm onSuccess={setPlacedOrder} />
          </div>
        </>
      )}
    </div>
  );
}
