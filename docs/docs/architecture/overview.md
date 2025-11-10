# Architecture Overview

IFSCFinder is designed as a cross-platform suite with a modular, service-oriented architecture. This document provides an overview of the system architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    IFSCFinder Platform                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Python     │  │ TypeScript   │  │     Go       │      │
│  │  (Canonical) │  │   (Node.js)  │  │  (Planned)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                  │
│                   ┌────────▼────────┐                        │
│                   │  Shared Database │                        │
│                   │   (SQLite + WAL) │                        │
│                   └─────────────────┘                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Database Layer

- **Storage**: SQLite database with embedded 42MB IFSC data
- **Mode**: WAL (Write-Ahead Logging) for concurrent access
- **Optimization**: Prepared statements, indexes, cache size tuning
- **Schema**: Single table with indexed columns for fast lookups

### 2. API Layer

- **Lookup Functions**: Core lookup with caching
- **Helper Functions**: Field-specific extraction functions
- **Search Functions**: Multi-criteria search with filtering
- **Utility Functions**: Normalization and cache management

### 3. Caching Layer

- **Strategy**: LRU (Least Recently Used) cache
- **Size**: Configurable (default: 1024 entries)
- **Scope**: Per-process singleton
- **Performance**: 40x speedup for repeated queries

### 4. Validation Layer

- **Input Validation**: IFSC code format validation
- **Normalization**: Uppercase conversion, whitespace trimming
- **Error Handling**: Graceful degradation with null returns

## Design Principles

### 1. API Parity

All language implementations maintain strict API parity:
- Same function signatures
- Same return types
- Same error handling
- Same performance characteristics

### 2. Performance First

- Sub-millisecond query times
- Optimized database queries
- Efficient caching strategies
- Minimal memory footprint

### 3. Zero Dependencies

- Bundled database (no external API calls)
- Minimal runtime dependencies
- Self-contained packages
- Offline-capable

### 4. Cross-Platform

- Consistent APIs across languages
- Shared validation rules
- Common performance targets
- Unified documentation

## Data Flow

```
User Request
    │
    ▼
Input Validation
    │
    ▼
Cache Check ────► Cache Hit ────► Return Cached Result
    │
    ▼
Cache Miss
    │
    ▼
Database Query (Prepared Statement)
    │
    ▼
Result Processing
    │
    ▼
Cache Update
    │
    ▼
Return Result
```

## Module Structure

### Python Implementation

```
ifscfinder/
├── main.py          # Database provider & core logic
├── utils.py          # Helper functions & caching
└── data/
    └── ifsc.db      # Embedded database
```

### TypeScript Implementation

```
ifscfinder-ts/
├── src/
│   ├── index.ts     # Public API
│   ├── db.ts        # Database provider
│   ├── cache.ts     # LRU cache
│   ├── normalize.ts # Validation
│   ├── search.ts    # Search implementation
│   └── types.ts     # TypeScript types
└── assets/
    └── ifsc.db      # Embedded database
```

## Performance Characteristics

### Lookup Performance

- **Uncached**: 0.01ms - 0.1ms per query
- **Cached**: 0.0004ms - 0.001ms per query
- **Throughput**: 100K+ lookups/second

### Memory Usage

- **Database**: 42MB (embedded SQLite)
- **Cache**: ~1MB (1024 entries)
- **Runtime**: Minimal overhead

### Scalability

- **Concurrent Access**: WAL mode supports multiple readers
- **Cache Efficiency**: LRU eviction prevents memory bloat
- **Query Optimization**: Indexed columns for fast searches

## Security Considerations

### Input Validation

- Strict IFSC code format validation
- SQL injection prevention (prepared statements)
- Null/empty value handling
- Error message sanitization

### Data Privacy

- No external API calls
- No data transmission
- Local-only processing
- Offline-capable

## Extension Points

### Custom Database Path

All implementations support custom database paths:

```python
from ifscfinder import IFSCDatabase

db = IFSCDatabase(db_path="/custom/path/ifsc.db")
```

### Cache Configuration

All implementations support cache size configuration:

```typescript
import { getCache } from 'ifscfinder-ts';

const cache = getCache(2048); // 2048 entry cache
```

## Future Enhancements

- **Browser Support**: WebAssembly SQLite for browser environments
- **GraphQL API**: GraphQL endpoint for advanced queries
- **REST API**: RESTful service for microservice architectures
- **Real-time Updates**: WebSocket support for live data updates

