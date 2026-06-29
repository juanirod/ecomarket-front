"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatus } from "@/lib/api/types";
import type { OrdenResponse } from "@/lib/api/types";
import { updateOrdenStatus } from "@/lib/api/endpoints";
import { toast } from "sonner";

const fmt = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" });

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: "Pendiente",
  [OrderStatus.CONFIRMADO]: "Confirmado",
  [OrderStatus.EN_PREPARACION]: "En preparación",
  [OrderStatus.ENVIADO]: "Enviado",
  [OrderStatus.CANCELADO]: "Cancelado",
};

const ALL_STATUSES = Object.values(OrderStatus);

interface OrderTableProps {
  orders: OrdenResponse[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const [rows, setRows] = useState<OrdenResponse[]>(orders);
  const [selected, setSelected] = useState<OrdenResponse | null>(null);

  async function handleStatusChange(orderId: number, newStatus: OrderStatus) {
    const snapshot = rows;
    // Optimistic update
    setRows((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selected?.id === orderId) {
      setSelected((s) => (s ? { ...s, status: newStatus } : s));
    }
    try {
      const updated = await updateOrdenStatus(orderId, newStatus);
      setRows((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );
      if (selected?.id === orderId) {
        setSelected((s) => (s ? { ...s, status: updated.status } : s));
      }
    } catch {
      // Revert on error
      setRows(snapshot);
      if (selected?.id === orderId) {
        const reverted = snapshot.find((o) => o.id === orderId);
        if (reverted) setSelected(reverted);
      }
      toast.error("Failed to update order status");
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Tracking</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setSelected(order)}
            >
              <TableCell className="font-medium">#{order.id}</TableCell>
              <TableCell className="text-sm">
                {order.nombre || order.apellido
                  ? `${order.nombre ?? ""} ${order.apellido ?? ""}`.trim()
                  : <span className="text-muted-foreground">—</span>}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {order.trackingNumber ?? "—"}
              </TableCell>
              <TableCell>
                {new Date(order.fechaCreacion).toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell>
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </TableCell>
              <TableCell>{fmt.format(order.totalFinal)}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground">
                {order.mensajePersonalizado || "—"}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <select
                  value={order.status ?? OrderStatus.PENDIENTE}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Order #{selected?.id}
              {selected?.trackingNumber && (
                <span className="ml-3 font-mono text-sm font-normal text-muted-foreground">
                  {selected.trackingNumber}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6">
              {/* Customer info */}
              {(selected.nombre || selected.apellido || selected.direccion || selected.codigoPostal) && (
                <div className="rounded-md border bg-muted/40 px-4 py-3 space-y-1">
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  {(selected.nombre || selected.apellido) && (
                    <p className="text-sm font-medium">
                      {`${selected.nombre ?? ""} ${selected.apellido ?? ""}`.trim()}
                    </p>
                  )}
                  {selected.direccion && (
                    <p className="text-sm text-muted-foreground">{selected.direccion}</p>
                  )}
                  {selected.codigoPostal && (
                    <p className="text-sm text-muted-foreground">CP {selected.codigoPostal}</p>
                  )}
                </div>
              )}

              {/* Items */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selected.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productoNombre}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right">
                        {fmt.format(item.precioUnitario)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {fmt.format(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Total */}
              <div className="flex justify-end border-t pt-4">
                <span className="text-sm text-muted-foreground mr-4">Total</span>
                <span className="font-semibold text-lg">
                  {fmt.format(selected.totalFinal)}
                </span>
              </div>

              {/* Notes */}
              {selected.mensajePersonalizado && (
                <div className="rounded-md border bg-muted/40 px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Customer note</p>
                  <p className="text-sm">{selected.mensajePersonalizado}</p>
                </div>
              )}

              {/* Meta */}
              <p className="text-xs text-muted-foreground">
                Placed on{" "}
                {new Date(selected.fechaCreacion).toLocaleString("es-AR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
