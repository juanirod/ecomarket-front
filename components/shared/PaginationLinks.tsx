import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationLinksProps {
  page: number;
  totalPages: number;
  basePath?: string;
}

export function PaginationLinks({
  page,
  totalPages,
  basePath = "/",
}: PaginationLinksProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button variant="outline" size="sm" asChild disabled={page === 0}>
        <Link href={`${basePath}?page=${page - 1}`}>
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          Previous
        </Link>
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={page >= totalPages - 1}
      >
        <Link href={`${basePath}?page=${page + 1}`}>
          Next
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </Button>
    </div>
  );
}
