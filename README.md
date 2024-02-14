# fecser

`fecser` is a versatile, type-safe HTTP request library designed for use across different JavaScript environments, including browsers, Node.js, and Deno. It supports both promise-based and streaming responses, configurable retries, timeout handling, and customizable fetch options for comprehensive HTTP request handling.

## Features

- **Environment-agnostic:** Works in browsers, Node.js, and Deno.
- **Module System Support:** Supports CommonJS and ES Module systems.
- **Streaming Data Handling:** Provides capabilities for handling streaming responses.
- **Retry Logic:** Configurable retry logic for handling request failures.
- **Timeout Handling:** Supports setting a timeout for requests.
- **Customizable Fetch Options:** Allows setting custom headers, query parameters, body content, and more.

## Installation

Install `fecser` using npm or Yarn:

```bash
npm install fecser
# or
yarn add fecser