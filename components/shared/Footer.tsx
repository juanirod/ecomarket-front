import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Leaf className="h-4 w-4" strokeWidth={1.75} />
          <span className="font-display font-medium">Eco Market</span>
        </div>
        <p>Sustainable products for a better world.</p>
      </div>
    </footer>
  );
}
