/**
 * Retry utilities with exponential backoff
 */

import { logger } from './logger.js';

export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

/**
 * Retries an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {},
  operationName: string = 'operation'
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;

  for (let attempt = 0; attempt < opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < opts.maxRetries - 1) {
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffFactor, attempt),
          opts.maxDelay
        );

        logger.warn(`${operationName} failed (attempt ${attempt + 1}/${opts.maxRetries}), retrying in ${delay}ms`, {
          error: lastError.message
        });

        await sleep(delay);
      }
    }
  }

  logger.error(`${operationName} failed after ${opts.maxRetries} attempts`, {
    error: lastError!.message
  });

  throw lastError!;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
