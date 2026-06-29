import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductoResponse } from "@/lib/api/types";

interface ProductCardProps {
  producto: ProductoResponse;
}

export function ProductCard({ producto }: ProductCardProps) {
  const isOutOfStock = producto.stock === 0;

  return (
    <Link href={`/products/${producto.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="relative aspect-square bg-muted">
          {producto.imagenUrl ? (
            <Image
              src={producto.imagenUrl}
              alt={producto.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-medium line-clamp-2">{producto.nombre}</h3>
          <div className="flex items-center justify-between">
            <span className="font-semibold">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(producto.precio)}
            </span>
            <Badge variant={isOutOfStock ? "destructive" : "secondary"}>
              {isOutOfStock ? "Out of stock" : "In stock"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
