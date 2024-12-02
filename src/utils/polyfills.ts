import { Buffer } from 'buffer';
import process from 'process';
import 'crypto-browserify';
import 'events';
import 'stream-browserify';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    process: typeof process;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  window.process = window.process || process;
  
  // Ensure global Buffer is available
  if (typeof global !== 'undefined' && !global.Buffer) {
    (global as any).Buffer = Buffer;
  }
}

export { Buffer };