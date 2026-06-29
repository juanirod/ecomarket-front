"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { OrderTable } from "@/components/admin/OrderTable";
import { getAdminOrdenes } from "@/lib/api/endpoints";
import type { OrdenResponse } from "@/lib/api/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrdenResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getAdminOrdenes().then(setOrders).catch(setError).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={6} />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All orders across all sessions.
        </p>
      </div>
      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Orders will appear here once customers start placing them."
        />
      ) : (
        <OrderTable orders={orders} />
      )}
    </>
  );
}
