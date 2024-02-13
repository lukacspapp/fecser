import './polyfills'
import { FetchOptions } from './types';

export async function fecser<TResponse, TBody>(
  url: string,
  options: FetchOptions<TBody>
): Promise<TResponse | void> {
  const {
    method,
    headers = {},
    body,
    retries = 0,
    retryDelay = 1000,
    timeout = 30000,
    responseType = 'json',
    queryParams = {},
    signal,
    onRetry,
    stream = false,
    onStreamChunk,
    onStreamError,
    onStreamEnd,
  } = options;

  const queryParamsString = new URLSearchParams(
    Object.entries(queryParams).map(([key, value]) => [key, String(value)])
  ).toString();
  const fullUrl = queryParamsString ? `${url}?${queryParamsString}` : url;

  const controller = signal ? undefined : new AbortController();
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : undefined;
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    signal: signal || controller?.signal,
  };

  try {
    const response = await fetch(fullUrl, fetchOptions);

    if (stream && response.body) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            if (onStreamEnd) onStreamEnd();
            else console.log('Stream ended.');
            break;
          }
          if (onStreamChunk) onStreamChunk(value);
          else console.log('Received chunk', value);
        }
      } catch (streamError) {
        if (onStreamError) onStreamError(streamError as Error);
        else console.error('Stream error:', streamError);
      }
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    switch (responseType) {
      case 'json':
        return await response.json() as unknown as TResponse;
      case 'text':
        return await response.text() as unknown as TResponse;
      case 'blob':
        return await response.blob() as unknown as TResponse;
      default:
        throw new Error("Unsupported response type");
    }
  } catch (error) {
    if (retries > 0) {
      onRetry?.(retries, error as Error);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return fecser<TResponse, TBody>(url, { ...options, retries: retries - 1 });
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      throw error;
    }
  }
}
