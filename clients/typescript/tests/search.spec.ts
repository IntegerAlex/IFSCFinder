/**
 * IFSCFinder TypeScript SDK - Search Tests
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { search, _reset } from '../src/index.js';

describe('search', () => {
  beforeEach(() => {
    _reset();
  });

  it('should search by bank name (exact match)', () => {
    const results = search({ bank: 'STATE BANK OF INDIA' }, { limit: 10 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.BANK === 'STATE BANK OF INDIA')).toBe(true);
  });

  it('should search by bank name (partial match)', () => {
    const results = search({ bank: 'HDFC' }, { exact: false, limit: 10 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.BANK?.includes('HDFC'))).toBe(true);
  });

  it('should search by state', () => {
    const results = search({ state: 'MAHARASHTRA' }, { limit: 10 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => r.STATE === 'MAHARASHTRA')).toBe(true);
  });

  it('should search by city', () => {
    const results = search({ city: 'MUMBAI' }, { limit: 10 });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => 
      r.CITY1 === 'MUMBAI' || r.CITY2 === 'MUMBAI'
    )).toBe(true);
  });

  it('should respect limit parameter', () => {
    const results = search({ state: 'MAHARASHTRA' }, { limit: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('should return empty array for no matches', () => {
    const results = search({ bank: 'NONEXISTENT BANK XYZ' });
    expect(results).toEqual([]);
  });

  it('should handle combined search params', () => {
    const results = search(
      { bank: 'STATE BANK OF INDIA', state: 'WEST BENGAL' },
      { limit: 10 }
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(r => 
      r.BANK === 'STATE BANK OF INDIA' && r.STATE === 'WEST BENGAL'
    )).toBe(true);
  });

  it('should return empty array for empty params', () => {
    const results = search({});
    expect(results).toEqual([]);
  });
});

