"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductoResponse } from "@/lib/api/types";

type ProductFormData = Omit<ProductoResponse, "id" | "fechaActualizacion">;

interface ProductFormProps {
  initial?: ProductFormData;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel?: string;
}

const EMPTY: ProductFormData = {
  nombre: "",
  descripcion: "",
  precio: 0,
  stock: 0,
  imagenUrl: "",
  activo: true,
};

export function ProductForm({
  initial = EMPTY,
  onSubmit,
  submitLabel = "Save",
}: ProductFormProps) {
  const [data, setData] = useState<ProductFormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const e: typeof errors = {};
    if (!data.nombre.trim()) e.nombre = "Name is required";
    if (data.precio <= 0) e.precio = "Price must be greater than 0";
    if (data.stock < 0) e.stock = "Stock cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="nombre">Name *</Label>
        <Input
          id="nombre"
          value={data.nombre}
          onChange={(e) => setData((d) => ({ ...d, nombre: e.target.value }))}
          className={errors.nombre ? "border-destructive" : ""}
        />
        {errors.nombre && (
          <p className="text-xs text-destructive">{errors.nombre}</p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="descripcion">Description</Label>
        <Textarea
          id="descripcion"
          value={data.descripcion}
          onChange={(e) =>
            setData((d) => ({ ...d, descripcion: e.target.value }))
          }
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="precio">Price (ARS) *</Label>
          <Input
            id="precio"
            type="number"
            min="0.01"
            step="0.01"
            value={data.precio}
            onChange={(e) =>
              setData((d) => ({ ...d, precio: parseFloat(e.target.value) || 0 }))
            }
            className={errors.precio ? "border-destructive" : ""}
          />
          {errors.precio && (
            <p className="text-xs text-destructive">{errors.precio}</p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={data.stock}
            onChange={(e) =>
              setData((d) => ({ ...d, stock: parseInt(e.target.value, 10) || 0 }))
            }
            className={errors.stock ? "border-destructive" : ""}
          />
          {errors.stock && (
            <p className="text-xs text-destructive">{errors.stock}</p>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="imagenUrl">Image URL</Label>
        <Input
          id="imagenUrl"
          type="url"
          value={data.imagenUrl}
          onChange={(e) =>
            setData((d) => ({ ...d, imagenUrl: e.target.value }))
          }
          placeholder="https://…"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="activo"
          checked={data.activo}
          onChange={(e) => setData((d) => ({ ...d, activo: e.target.checked }))}
          className="h-4 w-4"
        />
        <Label htmlFor="activo">Active</Label>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
