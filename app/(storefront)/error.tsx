"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <ErrorState error={error} />
      <div className="mt-4 flex justify-center">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </div>
    </div>
  );
}
