import { ApiError } from "@/lib/api/client";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: ApiError | Error | string;
}

export function ErrorState({ error }: ErrorStateProps) {
  const message =
    typeof error === "string"
      ? error
      : error instanceof ApiError
      ? error.payload.message
      : error.message || "An unexpected error occurred";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertCircle className="h-8 w-8 text-destructive" strokeWidth={1.75} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
