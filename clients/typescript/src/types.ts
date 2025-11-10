/**
 * IFSCFinder TypeScript SDK - Type Definitions
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

/**
 * IFSC details returned by lookup operations.
 * Field names are UPPERCASE to maintain parity with Python implementation.
 */
export type IfscDetails = Partial<{
  CODE: string;
  BANK: string;
  BRANCH: string;
  ADDRESS: string;
  CITY1: string;
  CITY2: string;
  STATE: string;
  STD_CODE: string;
}>;

/**
 * Search parameters for filtering IFSC records.
 */
export type SearchParams = {
  bank?: string;
  branch?: string;
  city?: string;
  state?: string;
};

/**
 * Search options for controlling search behavior.
 */
export type SearchOptions = {
  limit?: number;
  exact?: boolean; // true = exact match (=), false = LIKE match
};

