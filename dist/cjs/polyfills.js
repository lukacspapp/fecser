"use strict";
if (typeof fetch === 'undefined') {
    globalThis.fetch = (...args) => Promise.resolve().then(() => require('cross-fetch')).then(({ default: fetch }) => fetch(...args));
}
