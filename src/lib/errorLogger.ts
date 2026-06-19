// Centralized error logging. In production, only a short message is logged
// to avoid leaking internal details (API responses, object shapes, paths).
const isDev = import.meta.env.DEV;

export function logError(context: string, error: unknown): void {
  if (isDev) {
    // Full detail in development for debugging
    console.error(`[${context}]`, error);
    return;
  }
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "Unknown error";
  console.error(`[${context}] ${message}`);
}
