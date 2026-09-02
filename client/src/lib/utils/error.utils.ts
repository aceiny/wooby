/**
 * Extracts a readable error message from various error types.
 * Supports FastAPI backend errors: { error: { code: "...", message: "..." } },
 * NestJS validation arrays, standard message fields, native JS errors, and fallback strings.
 */
export function extractErrorMessage(
  error: unknown,
  fallback: string = "An unexpected error occurred",
): string {
  if (typeof error === "object" && error !== null) {
    // Axios error
    if ("response" in error && (error as any).response) {
      const resp = (error as any).response;

      // 1. FastAPI backend error format: { error: { code: "...", message: "..." } }
      if (resp.data?.error?.message && typeof resp.data.error.message === "string") {
        return resp.data.error.message;
      }

      // 2. Direct string error message field
      if (resp.data?.message && typeof resp.data.message === "string") {
        return resp.data.message;
      }

      // 3. Array of error messages (e.g. NestJS or validation errors)
      if (resp.data?.message && Array.isArray(resp.data.message)) {
        return resp.data.message.join(", ");
      }

      // 4. FastAPI detail string or list
      if (resp.data?.detail) {
        if (typeof resp.data.detail === "string") return resp.data.detail;
        if (Array.isArray(resp.data.detail)) {
          return resp.data.detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join(", ");
        }
      }

      // 5. Fallback to status text
      if (resp.statusText) return resp.statusText;
    }

    // Native JS error
    if ("message" in error && typeof (error as any).message === "string") {
      return (error as any).message;
    }
  }

  if (typeof error === "string") return error;

  return fallback;
}
