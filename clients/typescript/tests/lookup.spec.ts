/**
 * IFSCFinder TypeScript SDK - Lookup Tests
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeIfscCode,
  lookup,
  ifscToBank,
  ifscToBranch,
  ifscToAddress,
  ifscToCity1,
  ifscToState,
  clearCache,
  _reset,
} from '../src/index.js';

describe('normalizeIfscCode', () => {
  it('should normalize valid IFSC codes to uppercase', () => {
    expect(normalizeIfscCode('sbin0000001')).toBe('SBIN0000001');
    expect(normalizeIfscCode('HDFC0000001')).toBe('HDFC0000001');
    expect(normalizeIfscCode('IcIc0000001')).toBe('ICIC0000001');
  });

  it('should return null for invalid inputs', () => {
    expect(normalizeIfscCode(null)).toBe(null);
    expect(normalizeIfscCode(undefined)).toBe(null);
    expect(normalizeIfscCode('')).toBe(null);
    expect(normalizeIfscCode('SHORT')).toBe(null);
    expect(normalizeIfscCode('TOOLONGCODE123')).toBe(null);
    expect(normalizeIfscCode('INVALID@123')).toBe(null);
  });

  it('should trim whitespace', () => {
    expect(normalizeIfscCode('  SBIN0000001  ')).toBe('SBIN0000001');
  });
});

describe('lookup', () => {
  beforeEach(() => {
    // Clear cache before each test
    _reset();
  });

  it('should return valid IFSC details for known codes', () => {
    const details = lookup('SBIN0000001');
    expect(details).toBeTruthy();
    expect(details?.CODE).toBe('SBIN0000001');
    expect(details?.BANK).toBe('STATE BANK OF INDIA');
    expect(details?.BRANCH).toBe('KOLKATA MAIN');
    expect(details?.STATE).toBe('WEST BENGAL');
  });

  it('should return null for invalid IFSC codes', () => {
    expect(lookup('INVALID123')).toBe(null);
    expect(lookup('XXXX9999999')).toBe(null);
    expect(lookup('')).toBe(null);
  });

  it('should be case-insensitive', () => {
    const upper = lookup('SBIN0000001');
    const lower = lookup('sbin0000001');
    expect(lower).toEqual(upper);
  });

  it('should return uppercase field names (Python parity)', () => {
    const details = lookup('HDFC0000001');
    if (details) {
      expect(Object.keys(details).every(key => key === key.toUpperCase())).toBe(true);
    }
  });

  it('should omit null/empty fields (Python parity)', () => {
    const details = lookup('SBIN0000001');
    if (details) {
      const values = Object.values(details);
      expect(values.every(v => v && v.trim() !== '')).toBe(true);
    }
  });
});

describe('helper functions', () => {
  beforeEach(() => {
    _reset();
  });

  it('ifscToBank should return bank name', () => {
    expect(ifscToBank('SBIN0000001')).toBe('STATE BANK OF INDIA');
    expect(ifscToBank('INVALID123')).toBe(null);
  });

  it('ifscToBranch should return branch name', () => {
    expect(ifscToBranch('SBIN0000001')).toBe('KOLKATA MAIN');
    expect(ifscToBranch('INVALID123')).toBe(null);
  });

  it('ifscToAddress should return address', () => {
    const address = ifscToAddress('SBIN0000001');
    expect(address).toBeTruthy();
    expect(address).toContain('KOLKATA');
  });

  it('ifscToCity1 should return city', () => {
    expect(ifscToCity1('SBIN0000001')).toBe('KOLKATA');
  });

  it('ifscToState should return state', () => {
    expect(ifscToState('SBIN0000001')).toBe('WEST BENGAL');
  });
});

describe('caching', () => {
  beforeEach(() => {
    _reset();
  });

  it('should cache lookup results', () => {
    const first = lookup('SBIN0000001');
    const second = lookup('SBIN0000001');
    
    expect(second).toEqual(first);
  });

  it('should clear cache on clearCache()', () => {
    lookup('SBIN0000001');
    clearCache();
    
    // Should still work after cache clear
    const result = lookup('SBIN0000001');
    expect(result).toBeTruthy();
  });

  it('should cache null results', () => {
    const first = lookup('INVALID999');
    const second = lookup('INVALID999');
    
    expect(first).toBe(null);
    expect(second).toBe(null);
  });
});

