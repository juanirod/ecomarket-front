"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createOrden } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/client";
import type { OrdenResponse } from "@/lib/api/types";

const MAX_CHARS = 500;

interface CheckoutFormProps {
  onSuccess: (order: OrdenResponse) => void;
}

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const charCount = message.length;
  const isOverLimit = charCount > MAX_CHARS;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isOverLimit) return;

    setLoading(true);
    try {
      const order = await createOrden(
        message || undefined,
        nombre,
        apellido,
        direccion,
        codigoPostal
      );
      toast.success("Order placed successfully!");
      onSuccess(order);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.payload.message
          : "Failed to place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer information */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">First name</Label>
          <Input
            id="nombre"
            type="text"
            placeholder="Juan"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="apellido">Last name</Label>
          <Input
            id="apellido"
            type="text"
            placeholder="García"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
            disabled={loading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="direccion">Address</Label>
        <Input
          id="direccion"
          type="text"
          placeholder="Av. Corrientes 1234"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="codigoPostal">Postal code</Label>
        <Input
          id="codigoPostal"
          type="text"
          placeholder="1043"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {/* Optional personal message */}
      <div className="space-y-2">
        <Label htmlFor="message">Personal message (optional)</Label>
        <Textarea
          id="message"
          placeholder="Add a note to your order…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className={isOverLimit ? "border-destructive" : ""}
        />
        <div className="flex justify-end">
          <span
            className={`text-xs ${
              isOverLimit ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {charCount}/{MAX_CHARS}
            {isOverLimit && " — message too long"}
          </span>
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isOverLimit || loading}>
        {loading ? "Placing order…" : "Place order"}
      </Button>
    </form>
  );
}
