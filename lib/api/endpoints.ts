import { apiFetch } from "@/lib/api/client";
import { OrderStatus } from "@/lib/api/types";
import type {
  ProductoResponse,
  CarritoResponse,
  OrdenResponse,
  SpringPage,
} from "@/lib/api/types";

// Used by functions that bypass apiFetch (custom session ID or named error codes)
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8084"}/api/v1`;

// --- catalog ---
export function getProductos(
  page: number,
  size = 12
): Promise<SpringPage<ProductoResponse>> {
  return apiFetch(`/productos?page=${page}&size=${size}`);
}

export function getProducto(id: number): Promise<ProductoResponse> {
  return apiFetch(`/productos/${id}`);
}

// --- cart ---
export function getCarrito(): Promise<CarritoResponse> {
  return apiFetch("/carrito", { withSession: true });
}

export function addCartItem(
  productoId: number,
  cantidad: number
): Promise<CarritoResponse> {
  return apiFetch("/carrito/items", {
    method: "POST",
    body: JSON.stringify({ productoId, cantidad }),
    withSession: true,
  });
}

export function updateCartItem(
  itemId: number,
  cantidad: number
): Promise<CarritoResponse> {
  return apiFetch(`/carrito/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify({ cantidad }),
    withSession: true,
  });
}

export function removeCartItem(itemId: number): Promise<CarritoResponse> {
  return apiFetch(`/carrito/items/${itemId}`, {
    method: "DELETE",
    withSession: true,
  });
}

// --- checkout / orders ---
export function createOrden(
  mensajePersonalizado?: string,
  nombre?: string,
  apellido?: string,
  direccion?: string,
  codigoPostal?: string
): Promise<OrdenResponse> {
  return apiFetch("/ordenes", {
    method: "POST",
    body: JSON.stringify({
      mensajePersonalizado: mensajePersonalizado ?? null,
      nombre: nombre ?? null,
      apellido: apellido ?? null,
      direccion: direccion ?? null,
      codigoPostal: codigoPostal ?? null,
    }),
    withSession: true,
  });
}

export function updateOrdenStatus(
  id: number,
  status: OrderStatus
): Promise<OrdenResponse> {
  return apiFetch(`/ordenes/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// --- admin products ---
export function createProducto(
  data: Omit<ProductoResponse, "id" | "fechaActualizacion">
): Promise<ProductoResponse> {
  return apiFetch("/productos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProducto(
  id: number,
  data: Omit<ProductoResponse, "id" | "fechaActualizacion">
): Promise<ProductoResponse> {
  return apiFetch(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProducto(id: number): Promise<void> {
  return apiFetch(`/productos/${id}`, { method: "DELETE" });
}

// --- admin orders ---
export function getAdminOrdenes(): Promise<OrdenResponse[]> {
  return apiFetch("/ordenes");
}

// --- session cart cleanup ---
// Takes an explicit sessionId so callers (e.g. session TTL) can pass the old ID
// Uses fetch directly to avoid circular imports (apiFetch reads getSessionId())
export async function deleteCarrito(sessionId: string): Promise<void> {
  await fetch(`${API_BASE_URL}/carrito`, {
    method: "DELETE",
    headers: { "X-Session-Id": sessionId },
  });
  // best-effort: ignore errors
}

// --- order tracking ---
export async function getOrdenByTracking(trackingNumber: string): Promise<OrdenResponse> {
  const res = await fetch(
    `${API_BASE_URL}/ordenes/tracking/${encodeURIComponent(trackingNumber)}`
  );
  if (res.status === 404) throw new Error("NOT_FOUND");
  if (!res.ok) throw new Error("NETWORK_ERROR");
  return res.json() as Promise<OrdenResponse>;
}
