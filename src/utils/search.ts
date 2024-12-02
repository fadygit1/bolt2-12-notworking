import { generateRandomBigInt } from './crypto';

export function generateRandomPrivateKey(start: string, end: string): string {
  try {
    const startNum = BigInt(`0x${start}`);
    const endNum = BigInt(`0x${end}`);
    const randomNum = generateRandomBigInt(startNum, endNum);
    return randomNum.toString(16).padStart(64, '0');
  } catch (error) {
    console.error('Error generating random private key:', error);
    return start;
  }
}

export interface SearchResult {
  privateKey: string;
  address: string;
}

export interface SearchPerformance {
  speed: number;
  processedAddresses: number;
  estimatedTimeRemaining: number;
}

export interface SearchProgress {
  results: SearchResult[];
  performance: SearchPerformance;
}