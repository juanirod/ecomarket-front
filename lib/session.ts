const SESSION_KEY = "eco-market.session-id";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const API_BASE = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8084"}/api/v1`;

interface SessionData {
  id: string;
  createdAt: number;
}

export function getSessionId(): string {
  if (typeof window === "undefined") {
    throw new Error("session is client-only");
  }

  const raw = localStorage.getItem(SESSION_KEY);

  if (!raw) {
    // No session stored — create a fresh one
    const id = crypto.randomUUID();
    const data: SessionData = { id, createdAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return id;
  }

  let data: SessionData;
  try {
    data = JSON.parse(raw) as SessionData;
  } catch {
    // Legacy plain-string format — migrate without triggering expiry
    const id = raw;
    const migrated: SessionData = { id, createdAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(migrated));
    return id;
  }

  // TTL check — fire-and-forget cart deletion to avoid circular import
  if (Date.now() - data.createdAt > TTL_MS) {
    void fetch(`${API_BASE}/carrito`, {
      method: "DELETE",
      headers: { "X-Session-Id": data.id },
    }).catch(() => {});

    const id = crypto.randomUUID();
    const fresh: SessionData = { id, createdAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(fresh));
    return id;
  }

  return data.id;
}

export function resetSession(): string {
  if (typeof window === "undefined") {
    throw new Error("session is client-only");
  }
  const id = crypto.randomUUID();
  const data: SessionData = { id, createdAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return id;
}
