import './polyfills';
import { FetchOptions } from './types';
export declare function fecser<TResponse, TBody>(url: string, options: FetchOptions<TBody>): Promise<TResponse | void>;
