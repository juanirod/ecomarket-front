export interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  activo: boolean;
  fechaActualizacion: string;
}

export interface ItemCarritoResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  productoImagenUrl: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface CarritoResponse {
  id: number;
  sessionId: string;
  items: ItemCarritoResponse[];
  totalCalculado: number;
}

export enum OrderStatus {
  PENDIENTE = "PENDIENTE",
  CONFIRMADO = "CONFIRMADO",
  EN_PREPARACION = "EN_PREPARACION",
  ENVIADO = "ENVIADO",
  CANCELADO = "CANCELADO",
}

export interface OrdenResponse {
  id: number;
  sessionId: string;
  fechaCreacion: string;
  mensajePersonalizado: string | null;
  totalFinal: number;
  items: ItemCarritoResponse[];
  trackingNumber: string | null;
  nombre?: string;
  apellido?: string;
  direccion?: string;
  codigoPostal?: string;
  status?: OrderStatus;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}
