import { notFound } from "next/navigation";
import Image from "next/image";
import { getProducto } from "@/lib/api/endpoints";
import { AddToCartButton } from "@/components/storefront/AddToCartButton";
import { ApiError } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  let product;

  try {
    product = await getProducto(parseInt(id, 10));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
          {product.imagenUrl ? (
            <Image
              src={product.imagenUrl}
              alt={product.nombre}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-3xl font-semibold">{product.nombre}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(product.precio)}
            </span>
            <Badge variant={isOutOfStock ? "destructive" : "secondary"}>
              {isOutOfStock ? "Out of stock" : "In stock"}
            </Badge>
          </div>
          {product.descripcion && (
            <p className="text-muted-foreground leading-relaxed">
              {product.descripcion}
            </p>
          )}
          <div className="mt-auto pt-4">
            <AddToCartButton
              productoId={product.id}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
