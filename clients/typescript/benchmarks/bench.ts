/**
 * IFSCFinder TypeScript SDK - Performance Benchmarks
 * Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.
 * Licensed under LGPL-2.1
 */

import { Bench } from 'tinybench';
import { lookup, clearCache, _reset } from '../src/index.js';

// Test IFSC codes
const testCodes = [
  'SBIN0000001',
  'HDFC0000001',
  'ICIC0000001',
  'AXIS0000001',
  'KKBK0000001',
];

async function runBenchmarks() {
  console.log('IFSCFinder TypeScript SDK - Performance Benchmarks');
  console.log('='.repeat(60));
  console.log();

  // Benchmark 1: Uncached lookups
  console.log('1. Uncached Lookup Performance');
  console.log('-'.repeat(40));
  
  const uncachedBench = new Bench({ time: 1000 });
  
  uncachedBench.add('Single uncached lookup', () => {
    clearCache();
    lookup('SBIN0000001');
  });

  await uncachedBench.run();
  
  for (const task of uncachedBench.tasks) {
    const opsPerSec = task.result?.hz || 0;
    const avgTime = task.result?.mean ? task.result.mean * 1000 : 0;
    console.log(`${task.name}:`);
    console.log(`  ${opsPerSec.toFixed(0)} ops/sec`);
    console.log(`  ${avgTime.toFixed(4)}ms avg time`);
  }
  console.log();

  // Benchmark 2: Cached lookups
  console.log('2. Cached Lookup Performance');
  console.log('-'.repeat(40));
  
  // Prime the cache
  clearCache();
  lookup('SBIN0000001');

  const cachedBench = new Bench({ time: 1000 });
  
  cachedBench.add('Single cached lookup', () => {
    lookup('SBIN0000001');
  });

  await cachedBench.run();
  
  for (const task of cachedBench.tasks) {
    const opsPerSec = task.result?.hz || 0;
    const avgTime = task.result?.mean ? task.result.mean * 1000 : 0;
    console.log(`${task.name}:`);
    console.log(`  ${opsPerSec.toFixed(0)} ops/sec`);
    console.log(`  ${avgTime.toFixed(4)}ms avg time`);
  }
  console.log();

  // Benchmark 3: Mixed lookups
  console.log('3. Bulk Lookup Performance (Mixed Codes)');
  console.log('-'.repeat(40));
  
  const bulkBench = new Bench({ time: 1000 });
  
  bulkBench.add('100 mixed lookups', () => {
    clearCache();
    for (let i = 0; i < 20; i++) {
      for (const code of testCodes) {
        lookup(code);
      }
    }
  });

  await bulkBench.run();
  
  for (const task of bulkBench.tasks) {
    const opsPerSec = task.result?.hz || 0;
    const avgTime = task.result?.mean ? task.result.mean * 1000 : 0;
    const perLookup = avgTime / 100;
    console.log(`${task.name}:`);
    console.log(`  ${opsPerSec.toFixed(0)} ops/sec (batches)`);
    console.log(`  ${avgTime.toFixed(2)}ms per batch`);
    console.log(`  ${perLookup.toFixed(4)}ms per lookup`);
  }
  console.log();

  // Benchmark 4: Cache speedup comparison
  console.log('4. Cache Performance Comparison');
  console.log('-'.repeat(40));

  const comparisonBench = new Bench({ time: 1000 });
  
  comparisonBench.add('Uncached (1000 lookups)', () => {
    for (let i = 0; i < 1000; i++) {
      clearCache();
      lookup('SBIN0000001');
    }
  });

  comparisonBench.add('Cached (1000 lookups)', () => {
    clearCache();
    lookup('SBIN0000001'); // Prime cache
    for (let i = 0; i < 1000; i++) {
      lookup('SBIN0000001');
    }
  });

  await comparisonBench.run();
  
  const results: Record<string, number> = {};
  for (const task of comparisonBench.tasks) {
    const avgTime = task.result?.mean ? task.result.mean * 1000 : 0;
    const perLookup = avgTime / 1000;
    results[task.name] = perLookup;
    console.log(`${task.name}:`);
    console.log(`  ${perLookup.toFixed(4)}ms per lookup`);
  }

  if (results['Uncached (1000 lookups)'] && results['Cached (1000 lookups)']) {
    const speedup = results['Uncached (1000 lookups)'] / results['Cached (1000 lookups)'];
    console.log();
    console.log(`Cache speedup: ${speedup.toFixed(1)}x faster`);
  }

  console.log();
  console.log('='.repeat(60));
  console.log('Benchmark completed!');
  console.log();
  console.log('Python Baseline (for comparison):');
  console.log('  Uncached: 0.01ms per lookup (136,845 ops/sec)');
  console.log('  Cached:   0.00ms per lookup (5,526,092 ops/sec)');
  console.log('  Cache speedup: 40.4x faster');
}

runBenchmarks().catch(console.error);

