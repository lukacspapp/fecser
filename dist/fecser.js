var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import './polyfills';
export function fecser(url, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { method, headers = {}, body, retries = 0, retryDelay = 1000, timeout = 30000, responseType = 'json', queryParams = {}, signal, onRetry, stream = false, onStreamChunk, onStreamError, onStreamEnd, } = options;
        const queryParamsString = new URLSearchParams(Object.entries(queryParams).map(([key, value]) => [key, String(value)])).toString();
        const fullUrl = queryParamsString ? `${url}?${queryParamsString}` : url;
        const controller = signal ? undefined : new AbortController();
        const timeoutId = controller ? setTimeout(() => controller.abort(), timeout) : undefined;
        const fetchOptions = {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
            signal: signal || (controller === null || controller === void 0 ? void 0 : controller.signal),
        };
        try {
            const response = yield fetch(fullUrl, fetchOptions);
            if (stream && response.body) {
                const reader = response.body.getReader();
                try {
                    while (true) {
                        const { done, value } = yield reader.read();
                        if (done) {
                            if (onStreamEnd)
                                onStreamEnd();
                            else
                                console.log('Stream ended.');
                            break;
                        }
                        if (onStreamChunk)
                            onStreamChunk(value);
                        else
                            console.log('Received chunk', value);
                    }
                }
                catch (streamError) {
                    if (onStreamError)
                        onStreamError(streamError);
                    else
                        console.error('Stream error:', streamError);
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
                    return yield response.json();
                case 'text':
                    return yield response.text();
                case 'blob':
                    return yield response.blob();
                default:
                    throw new Error("Unsupported response type");
            }
        }
        catch (error) {
            if (retries > 0) {
                onRetry === null || onRetry === void 0 ? void 0 : onRetry(retries, error);
                yield new Promise(resolve => setTimeout(resolve, retryDelay));
                return fecser(url, Object.assign(Object.assign({}, options), { retries: retries - 1 }));
            }
            else {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                throw error;
            }
        }
    });
}
