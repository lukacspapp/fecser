// Assuming FetchOptions is defined in a separate file 'types.ts'
import { FetchOptions } from './types';

export async function fecser<TResponse, TBody>(
  url: string,
  options: FetchOptions<TBody>
): Promise<TResponse> {
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

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Handle different response types
    switch (responseType) {
      case 'json':
        return await response.json() as TResponse;
      case 'text':
        return await response.text() as TResponse;
      case 'blob':
        return await response.blob() as TResponse;
      default:
        throw new Error("Unsupported response type");
    }
  } catch (error) {
    if (retries > 0) {
      onRetry?.(retries, error);
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
