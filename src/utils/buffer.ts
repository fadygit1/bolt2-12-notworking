import { Buffer } from 'buffer';

// Make Buffer available globally
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

export { Buffer };