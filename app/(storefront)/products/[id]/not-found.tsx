import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <PackageX className="h-16 w-16 text-muted-foreground" strokeWidth={1.75} />
      <h2 className="font-display text-2xl font-semibold">Product not found</h2>
      <p className="text-muted-foreground">
        The product you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/">Back to catalog</Link>
      </Button>
    </div>
  );
}
