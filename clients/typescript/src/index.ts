/**
 * IFSCFinder TypeScript SDK
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 * 
 * High-performance IFSC code lookup utilities backed by SQLite.
 */

import { normalizeIfscCode } from './normalize.js';
import { getDatabase, resetDatabase } from './db.js';
import { getCache, resetCache } from './cache.js';
import { search } from './search.js';
import type { IfscDetails, SearchParams, SearchOptions } from './types.js';

// Re-export types
export type { IfscDetails, SearchParams, SearchOptions };

// Re-export normalization
export { normalizeIfscCode };

// Re-export search
export { search };

/**
 * Lookup IFSC code details with caching.
 * 
 * @param ifscCode - 11-character IFSC code (case-insensitive)
 * @returns IFSC details or null if not found/invalid
 * 
 * @example
 * const details = lookup('SBIN0000001');
 * if (details) {
 *   console.log(details.BANK, details.BRANCH);
 * }
 */
export function lookup(ifscCode: string): IfscDetails | null {
  const normalized = normalizeIfscCode(ifscCode);
  if (!normalized) {
    return null;
  }

  // Check cache first
  const cache = getCache();
  const cached = cache.get(normalized);
  if (cached !== undefined) {
    return cached;
  }

  // Lookup in database
  const db = getDatabase();
  const result = db.lookup(normalized);

  // Cache the result (including null for not found)
  cache.set(normalized, result);

  return result;
}

/**
 * Get bank name for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns Bank name or null if not found
 */
export function ifscToBank(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.BANK ?? null;
}

/**
 * Get branch name for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns Branch name or null if not found
 */
export function ifscToBranch(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.BRANCH ?? null;
}

/**
 * Get address for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns Address or null if not found
 */
export function ifscToAddress(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.ADDRESS ?? null;
}

/**
 * Get CITY1 for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns CITY1 or null if not found
 */
export function ifscToCity1(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.CITY1 ?? null;
}

/**
 * Get CITY2 for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns CITY2 or null if not found
 */
export function ifscToCity2(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.CITY2 ?? null;
}

/**
 * Get state for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns State name or null if not found
 */
export function ifscToState(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.STATE ?? null;
}

/**
 * Get STD code for an IFSC code.
 * 
 * @param ifscCode - 11-character IFSC code
 * @returns STD code or null if not found
 */
export function ifscToStdCode(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  return details?.STD_CODE ?? null;
}

/**
 * Clear the lookup cache.
 * Call this when the database is updated or to free memory.
 */
export function clearCache(): void {
  const cache = getCache();
  cache.clear();
}

/**
 * Internal: Reset database and cache (for testing).
 * @internal
 */
export function _reset(): void {
  resetDatabase();
  resetCache();
}

