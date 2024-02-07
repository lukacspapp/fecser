
if (typeof fetch === 'undefined') {
  globalThis.fetch = (...args) => import('cross-fetch').then(({ default: fetch }) => fetch(...args));
}
