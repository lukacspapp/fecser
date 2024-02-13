export declare type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
export interface FetchOptions<Body> {
    method: HttpMethod;
    headers?: HeadersInit;
    body?: Body;
    retries?: number;
    retryDelay?: number;
    timeout?: number;
    responseType?: 'json' | 'text' | 'blob';
    queryParams?: Record<string, string | number | boolean>;
    signal?: AbortSignal;
    onRetry?: (attempt: number, error: Error) => void;
    stream?: boolean;
    onStreamChunk?: (chunk: Uint8Array) => void;
    onStreamError?: (error: Error) => void;
    onStreamEnd?: () => void;
}
export interface FetchResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: Headers;
}
//# sourceMappingURL=types.d.ts.map