import { Buffer } from 'buffer';

export function generateRandomBytes(length: number): Buffer {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Buffer.from(array);
}

export function bytesToHex(buffer: Buffer): string {
  return buffer.toString('hex');
}

export function hexToBuffer(hex: string): Buffer {
  return Buffer.from(hex, 'hex');
}

export function generateRandomBigInt(min: bigint, max: bigint): bigint {
  const range = max - min;
  const bitsNeeded = range.toString(2).length;
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  
  let result: bigint;
  do {
    const randomBytes = generateRandomBytes(bytesNeeded);
    result = BigInt('0x' + randomBytes.toString('hex')) % range;
  } while (result > range);
  
  return min + result;
}