# IFSCFinder (TypeScript/Node.js)

High-performance IFSC code lookup utilities backed by SQLite for Node.js applications. TypeScript port of the canonical Python implementation with full API parity.

## Features

- **Lightning-fast lookups**: Sub-millisecond query times with embedded SQLite
- **Built-in caching**: LRU cache for 40x speedup on repeated queries
- **Zero-config**: Bundled database covering India's complete banking network
- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Node-first**: Optimized for Node.js 18+ with ESM and CommonJS support
- **API parity**: Consistent interface with Python implementation

## Installation

```bash
npm install ifscfinder-ts
```

**Note for pnpm users**: `better-sqlite3` requires native bindings. After installation, run:

```bash
pnpm rebuild better-sqlite3
```

Or use npm instead of pnpm for automatic native module compilation.

## Quick Start

```typescript
import { lookup, ifscToBank, search } from 'ifscfinder-ts';

// Basic lookup
const details = lookup('SBIN0000001');
console.log(details);
// {
//   CODE: 'SBIN0000001',
//   BANK: 'STATE BANK OF INDIA',
//   BRANCH: 'KOLKATA MAIN',
//   ADDRESS: 'SAMRIDDHI BHAWAN, 1 STRAND ROAD, KOLKATA 700 001',
//   CITY1: 'KOLKATA',
//   CITY2: 'KOLKATA',
//   STATE: 'WEST BENGAL'
// }

// Field-specific helpers
const bank = ifscToBank('HDFC0000001');
console.log(bank); // 'HDFC BANK'

// Search by bank, branch, city, or state
const results = search({ bank: 'HDFC BANK', state: 'MAHARASHTRA' }, { limit: 10 });
```

## API Reference

### `lookup(ifscCode: string): IfscDetails | null`

Lookup IFSC code details with caching.

**Parameters:**
- `ifscCode` - 11-character IFSC code (case-insensitive)

**Returns:**
- Object with IFSC details or `null` if not found/invalid

**Example:**
```typescript
const details = lookup('SBIN0000001');
if (details) {
  console.log(details.BANK, details.BRANCH);
}
```

### Helper Functions

Convenience functions for extracting specific fields:

- `ifscToBank(ifscCode: string): string | null` - Get bank name
- `ifscToBranch(ifscCode: string): string | null` - Get branch name
- `ifscToAddress(ifscCode: string): string | null` - Get address
- `ifscToCity1(ifscCode: string): string | null` - Get city (primary)
- `ifscToCity2(ifscCode: string): string | null` - Get city (secondary)
- `ifscToState(ifscCode: string): string | null` - Get state
- `ifscToStdCode(ifscCode: string): string | null` - Get STD code

### `search(params: SearchParams, options?: SearchOptions): IfscDetails[]`

Search for IFSC codes by bank, branch, city, or state.

**Parameters:**
- `params` - Search criteria (`{ bank?, branch?, city?, state? }`)
- `options` - Optional configuration:
  - `limit` - Maximum results (default: 100)
  - `exact` - Exact match vs LIKE search (default: true)

**Returns:**
- Array of matching IFSC details

**Example:**
```typescript
// Exact match
const results = search({ bank: 'STATE BANK OF INDIA' });

// Partial match with limit
const results = search(
  { bank: 'HDFC' },
  { exact: false, limit: 50 }
);

// Combined filters
const results = search({
  state: 'MAHARASHTRA',
  city: 'MUMBAI'
});
```

### `normalizeIfscCode(code: string | null | undefined): string | null`

Normalize and validate an IFSC code.

**Parameters:**
- `code` - IFSC code to normalize

**Returns:**
- Uppercase normalized code or `null` if invalid

**Validation Rules:**
- Must be exactly 11 characters
- Must be alphanumeric
- Converted to uppercase

### `clearCache(): void`

Clear the lookup cache. Call this when the database is updated or to free memory.

## Type Definitions

```typescript
type IfscDetails = Partial<{
  CODE: string;
  BANK: string;
  BRANCH: string;
  ADDRESS: string;
  CITY1: string;
  CITY2: string;
  STATE: string;
  STD_CODE: string;
}>;

type SearchParams = {
  bank?: string;
  branch?: string;
  city?: string;
  state?: string;
};

type SearchOptions = {
  limit?: number;      // Default: 100
  exact?: boolean;     // Default: true
};
```

## Performance

Benchmarks on Node.js 22 (Apple M1):

| Operation | Performance |
|-----------|-------------|
| Uncached lookup | ~0.015ms per query |
| Cached lookup | ~0.0004ms per query |
| Cache speedup | 37.5x faster |
| Throughput (uncached) | ~66,000 ops/sec |
| Throughput (cached) | ~2,500,000 ops/sec |

**Python Baseline (for comparison):**
- Uncached: 0.01ms (136,845 ops/sec)
- Cached: 0.00ms (5,526,092 ops/sec)
- Cache speedup: 40.4x

TypeScript implementation achieves ~48% of Python's uncached performance and ~45% of cached performance, which is excellent for a JavaScript runtime.

## Data Source

The package bundles a 42MB SQLite database covering all Indian banks and branches. The database is included in the npm package and requires no external dependencies or downloads.

**Database configuration:**
- WAL mode enabled for concurrent access
- 1MB cache size
- Prepared statements for optimal performance

## Development

```bash
# Install dependencies
npm install

# If using pnpm, rebuild native modules
pnpm rebuild better-sqlite3  # Only needed for pnpm

# Build
npm run build

# Run tests
npm test

# Run benchmarks
npm run bench

# Type check
npm run typecheck
```

## Project Structure

```
clients/typescript/
├── src/
│   ├── index.ts       # Public API
│   ├── db.ts          # SQLite provider
│   ├── cache.ts       # LRU cache
│   ├── normalize.ts   # Validation
│   ├── search.ts      # Search implementation
│   └── types.ts       # TypeScript types
├── tests/
│   ├── lookup.spec.ts
│   └── search.spec.ts
├── benchmarks/
│   └── bench.ts
└── assets/
    └── ifsc.db        # Bundled database
```

## API Parity with Python

This TypeScript implementation maintains strict API parity with the Python package:

| Feature | Python | TypeScript |
|---------|--------|------------|
| Field names | UPPERCASE | ✅ UPPERCASE |
| Null handling | Omit empty keys | ✅ Omit empty keys |
| Validation | 11-char alphanumeric | ✅ 11-char alphanumeric |
| Caching | LRU cache | ✅ LRU cache |
| Database | SQLite + WAL | ✅ SQLite + WAL |

## Requirements

- Node.js >= 18
- No additional dependencies required (better-sqlite3 included)

## Related Projects

- **Python**: [ifscfinder](https://github.com/IntegerAlex/IFSCFinder/tree/main/python) - Canonical implementation
- **Go**: Coming soon
- **Rust**: Coming soon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Run `npm test` and `npm run typecheck`
5. Submit a pull request

See the main [repository](https://github.com/IntegerAlex/IFSCFinder) for contribution guidelines.

## License

LGPL-2.1 License

**Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.**

This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation; either version 2.1 of the License, or (at your option) any later version.

See the [LICENSE](./LICENSE) file for full terms.

## Links

- **Repository**: https://github.com/IntegerAlex/IFSCFinder
- **Issues**: https://github.com/IntegerAlex/IFSCFinder/issues
- **Documentation**: https://github.com/IntegerAlex/IFSCFinder/wiki
- **NPM**: https://www.npmjs.com/package/ifscfinder-ts (coming soon)

