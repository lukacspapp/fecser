export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface FetchOptions<TBody> {
  method: HttpMethod;
  headers?: HeadersInit;
  body?: TBody;
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob';
  queryParams?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
  onRetry?: (attempt: number, error: Error) => void; // Callback for retries
}

export interface FetchResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}
