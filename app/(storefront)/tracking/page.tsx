import { TrackingSearch } from "@/components/storefront/TrackingSearch";

export default function TrackingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-3xl font-semibold mb-8">Seguimiento de Orden</h1>
      <TrackingSearch />
    </div>
  );
}
