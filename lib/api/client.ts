import { getSessionId } from "@/lib/session";
import type { ErrorResponse } from "@/lib/api/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8084";

export class ApiError extends Error {
  constructor(
    public status: number,
    public payload: ErrorResponse
  ) {
    super(payload.message);
    this.name = "ApiError";
  }
}

interface ApiOptions extends RequestInit {
  withSession?: boolean;
}

export async function apiFetch<T>(
  path: string,
  opts: ApiOptions = {}
): Promise<T> {
  const { withSession, ...fetchOpts } = opts;
  const headers = new Headers(fetchOpts.headers);
  headers.set("Content-Type", "application/json");

  if (withSession) {
    headers.set("X-Session-Id", getSessionId());
  }

  const res = await fetch(`${BASE}/api/v1${path}`, { ...fetchOpts, headers });

  if (!res.ok) {
    const payload = await res.json().catch(
      () =>
        ({
          timestamp: "",
          status: res.status,
          error: "Error",
          message: "Unexpected error",
        } as ErrorResponse)
    );
    throw new ApiError(res.status, payload);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
