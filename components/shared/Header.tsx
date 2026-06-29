"use client";

import Link from "next/link";
import { ShoppingCart, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartCount } from "@/lib/cart-count-context";

export function Header() {
  const count = useCartCount();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <Leaf className="h-5 w-5 text-primary" strokeWidth={1.75} />
          Eco Market
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Catalog
          </Link>
          <Link href="/tracking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Track Order
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
            {count > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 text-xs">
                {count}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
