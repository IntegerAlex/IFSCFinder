/**
 * IFSCFinder TypeScript SDK - LRU Cache
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

import type { IfscDetails } from './types.js';

/**
 * Simple LRU cache for IFSC lookup results.
 */
export class LRUCache {
  private cache: Map<string, IfscDetails | null>;
  private maxSize: number;

  constructor(maxSize: number = 1024) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  /**
   * Get a value from the cache.
   */
  get(key: string): IfscDetails | null | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  /**
   * Set a value in the cache.
   */
  set(key: string, value: IfscDetails | null): void {
    // Remove if exists (to update order)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Add to end
    this.cache.set(key, value);

    // Evict oldest if over capacity
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
  }

  /**
   * Clear all entries from the cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get current cache size.
   */
  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
let cacheInstance: LRUCache | null = null;

/**
 * Get the global cache instance.
 */
export function getCache(size?: number): LRUCache {
  if (!cacheInstance) {
    cacheInstance = new LRUCache(size);
  }
  return cacheInstance;
}

/**
 * Reset the global cache instance.
 */
export function resetCache(): void {
  cacheInstance = null;
}

