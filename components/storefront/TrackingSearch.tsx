"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrdenByTracking } from "@/lib/api/endpoints";
import { OrderStatus } from "@/lib/api/types";
import type { OrdenResponse } from "@/lib/api/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: "Pendiente",
  [OrderStatus.CONFIRMADO]: "Confirmado",
  [OrderStatus.EN_PREPARACION]: "En preparación",
  [OrderStatus.ENVIADO]: "Enviado",
  [OrderStatus.CANCELADO]: "Cancelado",
};

export function TrackingSearch() {
  const [trackingInput, setTrackingInput] = useState("");
  const [result, setResult] = useState<OrdenResponse | null>(null);
  const [error, setError] = useState<"NOT_FOUND" | "NETWORK_ERROR" | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = trackingInput.trim();
    if (!query) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const order = await getOrdenByTracking(query);
      setResult(order);
    } catch (err) {
      const message = err instanceof Error ? err.message : "NETWORK_ERROR";
      setError(message === "NOT_FOUND" ? "NOT_FOUND" : "NETWORK_ERROR");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tracking">Número de seguimiento</Label>
          <div className="flex gap-2">
            <Input
              id="tracking"
              placeholder="ECO-20240101-ABCDEF"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading || !trackingInput.trim()}>
              {loading ? "Buscando…" : "Buscar"}
            </Button>
          </div>
        </div>
      </form>

      {error === "NOT_FOUND" && (
        <p className="text-sm text-destructive">
          Orden no encontrada. Verificá el número de seguimiento.
        </p>
      )}

      {error === "NETWORK_ERROR" && (
        <p className="text-sm text-destructive">
          Error al buscar la orden. Intentá de nuevo.
        </p>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Orden #{result.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.status && (
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-semibold">{STATUS_LABELS[result.status]}</p>
              </div>
            )}
            {result.trackingNumber && (
              <div>
                <p className="text-sm text-muted-foreground">Número de seguimiento</p>
                <p className="font-mono font-semibold tracking-wider">{result.trackingNumber}</p>
              </div>
            )}
            {(result.nombre || result.apellido) && (
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p>{[result.nombre, result.apellido].filter(Boolean).join(" ")}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p>
                {new Date(result.fechaCreacion).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(result.totalFinal)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Productos ({result.items.length})
              </p>
              <ul className="space-y-1">
                {result.items.map((item) => (
                  <li key={item.id} className="text-sm flex justify-between">
                    <span>
                      {item.productoNombre} × {item.cantidad}
                    </span>
                    <span className="text-muted-foreground">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(item.subtotal)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {result.mensajePersonalizado && (
              <div>
                <p className="text-sm text-muted-foreground">Mensaje</p>
                <p className="text-sm italic">{result.mensajePersonalizado}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
