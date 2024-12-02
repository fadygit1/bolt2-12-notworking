import { expose } from 'comlink';
import { isValidPrivateKey, privateKeyToAddress, isInRange } from '../utils/bitcoin';
import { generateRandomPrivateKey } from '../utils/search';
import type { SearchProgress, SearchResult } from '../utils/search';

interface SearchParams {
  start: string;
  end: string;
  targetAddresses: string[];
  iterations: number;
}

let shouldStop = false;

self.onmessage = (event) => {
  if (event.data.type === 'STOP') {
    shouldStop = true;
  }
};

const searchWorker = {
  async search({ start, end, targetAddresses, iterations }: SearchParams) {
    shouldStop = false;
    const results = new Set<SearchResult>();
    let processedAddresses = 0;
    const startTime = Date.now();
    let lastUpdateTime = startTime;

    try {
      while (!shouldStop) {
        for (let i = 0; i < iterations && !shouldStop; i++) {
          const privateKey = generateRandomPrivateKey(start, end);
          
          if (!isValidPrivateKey(privateKey) || !isInRange(privateKey, start, end)) {
            continue;
          }

          const address = privateKeyToAddress(privateKey);
          processedAddresses++;

          if (targetAddresses.includes(address)) {
            results.add({ privateKey, address });
            self.postMessage({
              type: 'PROGRESS',
              payload: createProgress(results, processedAddresses, startTime)
            });
          }
        }

        const currentTime = Date.now();
        if (currentTime - lastUpdateTime >= 1000) {
          self.postMessage({
            type: 'PROGRESS',
            payload: createProgress(results, processedAddresses, startTime)
          });
          lastUpdateTime = currentTime;
        }
      }
    } catch (error) {
      console.error('Search worker error:', error);
      throw error;
    }

    if (shouldStop) {
      throw new Error('Search aborted');
    }
  }
};

function createProgress(
  results: Set<SearchResult>,
  processedAddresses: number,
  startTime: number
): SearchProgress {
  const elapsedTime = (Date.now() - startTime) / 1000;
  const speed = processedAddresses / elapsedTime;
  const foundCount = results.size;

  return {
    results: Array.from(results),
    performance: {
      speed,
      processedAddresses,
      estimatedTimeRemaining: foundCount > 0 
        ? (targetAddresses.length - foundCount) * (elapsedTime / foundCount)
        : Infinity
    }
  };
}

expose(searchWorker);