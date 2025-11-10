# API Overview

IFSCFinder provides a consistent API across all supported languages. This page provides an overview of the API design and common patterns.

## Core Functions

### Lookup Functions

All implementations provide these core functions:

- **`lookup(ifscCode)`** - Get full IFSC details
- **`ifscToBank(ifscCode)`** - Get bank name
- **`ifscToBranch(ifscCode)`** - Get branch name
- **`ifscToAddress(ifscCode)`** - Get address
- **`ifscToCity1(ifscCode)`** - Get primary city
- **`ifscToCity2(ifscCode)`** - Get secondary city
- **`ifscToState(ifscCode)`** - Get state
- **`ifscToStdCode(ifscCode)`** - Get STD code

### Search Functions

- **`search(params, options?)`** - Search by bank, branch, city, or state

### Utility Functions

- **`normalizeIfscCode(code)`** - Normalize and validate IFSC code
- **`clearCache()`** - Clear lookup cache

## API Parity

All language implementations maintain strict API parity:

| Feature | Python | TypeScript | Go | Rust |
|---------|--------|------------|----|----|
| Field names | UPPERCASE | ✅ UPPERCASE | ✅ UPPERCASE | ✅ UPPERCASE |
| Null handling | Omit empty | ✅ Omit empty | ✅ Omit empty | ✅ Omit empty |
| Validation | 11-char alnum | ✅ 11-char alnum | ✅ 11-char alnum | ✅ 11-char alnum |
| Caching | LRU cache | ✅ LRU cache | ✅ LRU cache | ✅ LRU cache |
| Database | SQLite + WAL | ✅ SQLite + WAL | ✅ SQLite + WAL | ✅ SQLite + WAL |

## Return Types

### IfscDetails

All implementations return the same structure:

```typescript
type IfscDetails = {
  CODE: string;
  BANK: string;
  BRANCH: string;
  ADDRESS: string;
  CITY1: string;
  CITY2: string;
  STATE: string;
  STD_CODE?: string;
}
```

**Note:** Fields with null/empty values are omitted (Python parity).

## Error Handling

All implementations follow the same error handling pattern:

- **Invalid IFSC code**: Returns `null` (Python) or `null` (TypeScript)
- **Not found**: Returns `null`
- **Database errors**: Returns `null` (graceful degradation)

## Performance

All implementations target the same performance goals:

- **Uncached lookup**: < 0.1ms per query
- **Cached lookup**: < 0.001ms per query
- **Throughput**: 100K+ lookups/second

## Language-Specific Documentation

- [Python API Reference](/docs/api/python/lookup)
- [TypeScript API Reference](/docs/api/typescript/lookup)
- [API Contracts](/docs/api/contracts)

