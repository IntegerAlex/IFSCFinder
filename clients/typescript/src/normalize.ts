/**
 * IFSCFinder TypeScript SDK - IFSC Code Normalization
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

/**
 * Normalizes an IFSC code to uppercase and validates format.
 * 
 * @param code - IFSC code to normalize (can be null/undefined)
 * @returns Normalized IFSC code or null if invalid
 * 
 * Validation rules (parity with Python):
 * - Must be exactly 11 characters
 * - Must be alphanumeric
 * - Converted to uppercase
 */
export function normalizeIfscCode(code: string | null | undefined): string | null {
  if (!code || typeof code !== 'string') {
    return null;
  }

  const trimmed = code.trim();
  
  // Must be exactly 11 characters
  if (trimmed.length !== 11) {
    return null;
  }

  // Must be alphanumeric
  if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
    return null;
  }

  return trimmed.toUpperCase();
}

