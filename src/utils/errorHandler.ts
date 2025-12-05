import axios from "axios";

/**
 * Extracts a friendly error message from various error shapes:
 * - Axios errors with response.data (handles .message, .Message, .title, and ASP.NET-style errors)
 * - Plain Error instances
 * - String or object errors
 *
 * Returns `defaultMessage` if no useful text is found.
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  const isRecord = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null;

  const getProp = (obj: Record<string, unknown>, key: string): unknown =>
    Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // If response body is a simple string, return it
    if (typeof data === "string" && data.trim().length > 0) {
      return data;
    }

    if (isRecord(data)) {
      // Common single-message properties (case variations)
      const candidates = [
        getProp(data, "message"),
        getProp(data, "Message"),
        getProp(data, "title"),
        getProp(data, "error"),
      ];

      for (const cand of candidates) {
        if (typeof cand === "string" && cand.trim().length > 0) return cand;
        if (cand !== undefined && cand !== null && String(cand).trim().length > 0)
          return String(cand);
      }

      // ASP.NET validation errors: { errors: { field: [ "msg", ... ] } }
      const errors = getProp(data, "errors");
      if (isRecord(errors)) {
        const firstErrorValue = Object.values(errors)[0];
        if (Array.isArray(firstErrorValue) && firstErrorValue.length > 0) {
          const first = firstErrorValue[0];
          if (typeof first === "string" && first.trim().length > 0) return first;
          if (first !== undefined && first !== null && String(first).trim().length > 0)
            return String(first);
        }
        if (typeof firstErrorValue === "string" && firstErrorValue.trim().length > 0) {
          return firstErrorValue;
        }
        if (
          firstErrorValue !== undefined &&
          firstErrorValue !== null &&
          String(firstErrorValue).trim().length > 0
        ) {
          return String(firstErrorValue);
        }
      }
    }

    // axios.isAxiosError narrows `error` to AxiosError — it has a `message` property.
    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }

    return defaultMessage;
  }

  if (error instanceof Error) {
    return error.message || defaultMessage;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return error;
  }

  if (isRecord(error)) {
    const e = error as Record<string, unknown>;
    const m = getProp(e, "message");
    if (typeof m === "string" && m.trim().length > 0) return m;
    if (m !== undefined && m !== null && String(m).trim().length > 0) return String(m);

    const t = getProp(e, "title");
    if (typeof t === "string" && t.trim().length > 0) return t;
    if (t !== undefined && t !== null && String(t).trim().length > 0) return String(t);
  }

  return defaultMessage;
}
