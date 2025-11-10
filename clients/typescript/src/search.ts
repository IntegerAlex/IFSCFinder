/**
 * IFSCFinder TypeScript SDK - Search API
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

import { getDatabase } from './db.js';
import type { IfscDetails, SearchParams, SearchOptions } from './types.js';

/**
 * Search for IFSC codes by bank, branch, city, or state.
 * 
 * @param params - Search parameters (bank, branch, city, state)
 * @param options - Search options (limit, exact match)
 * @returns Array of matching IFSC details
 * 
 * @example
 * // Exact match
 * const results = search({ bank: 'STATE BANK OF INDIA' });
 * 
 * // Partial match
 * const results = search({ bank: 'HDFC' }, { exact: false, limit: 50 });
 */
export function search(
  params: SearchParams,
  options?: SearchOptions
): IfscDetails[] {
  const db = getDatabase();
  return db.search(params, options);
}

