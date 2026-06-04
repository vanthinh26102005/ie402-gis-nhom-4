export type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
  error: { message: string; code?: string } | null;
  message?: string;
};

export type ApiResult<T = void> =
  | { ok: true; data?: T; message: string }
  | { ok: false; message: string };
