"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProductForm } from "./ProductForm";
import { updateProducto, deleteProducto } from "@/lib/api/endpoints";
import type { ProductoResponse } from "@/lib/api/types";

interface ProductTableProps {
  products: ProductoResponse[];
  onMutated: () => void;
}

export function ProductTable({ products, onMutated }: ProductTableProps) {
  const [editing, setEditing] = useState<ProductoResponse | null>(null);
  const [deleting, setDeleting] = useState<ProductoResponse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleUpdate(data: Omit<ProductoResponse, "id" | "fechaActualizacion">) {
    if (!editing) return;
    await updateProducto(editing.id, data);
    toast.success("Product updated");
    setEditing(null);
    onMutated();
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await deleteProducto(deleting.id);
      toast.success("Product deleted");
      setDeleting(null);
      onMutated();
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.nombre}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(p.precio)}
              </TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>
                <Badge variant={p.activo ? "secondary" : "outline"}>
                  {p.activo ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(p)}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(p)}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit product</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              initial={editing}
              onSubmit={handleUpdate}
              submitLabel="Update product"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleting?.nombre}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
