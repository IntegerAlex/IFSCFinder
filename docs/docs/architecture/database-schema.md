# Database Schema

IFSCFinder uses a SQLite database with an optimized schema for fast lookups.

## Table Structure

### `ifsc_codes` Table

```sql
CREATE TABLE ifsc_codes (
    code TEXT PRIMARY KEY,
    bank TEXT,
    branch TEXT,
    address TEXT,
    city1 TEXT,
    city2 TEXT,
    state TEXT,
    std_code TEXT
);
```

### Column Descriptions

- **`code`** (TEXT, PRIMARY KEY): 11-character IFSC code (e.g., "SBIN0000001")
- **`bank`** (TEXT): Bank name (e.g., "STATE BANK OF INDIA")
- **`branch`** (TEXT): Branch name (e.g., "KOLKATA MAIN")
- **`address`** (TEXT): Full branch address
- **`city1`** (TEXT): Primary city name
- **`city2`** (TEXT): Secondary city name (may be same as city1)
- **`state`** (TEXT): State name (e.g., "WEST BENGAL")
- **`std_code`** (TEXT): STD code (optional, may be null)

## Indexes

For optimal search performance, the following indexes are created:

```sql
CREATE INDEX idx_bank ON ifsc_codes(bank);
CREATE INDEX idx_state ON ifsc_codes(state);
CREATE INDEX idx_city1 ON ifsc_codes(city1);
CREATE INDEX idx_city2 ON ifsc_codes(city2);
```

### Index Usage

- **`idx_bank`**: Used for bank name searches
- **`idx_state`**: Used for state searches
- **`idx_city1`**: Used for city searches (primary)
- **`idx_city2`**: Used for city searches (secondary)

## Database Configuration

### WAL Mode

Write-Ahead Logging (WAL) mode is enabled for better concurrent access:

```sql
PRAGMA journal_mode = WAL;
```

**Benefits:**
- Multiple readers can access database simultaneously
- Better performance for read-heavy workloads
- Reduced lock contention

### Synchronous Mode

Normal synchronous mode for balanced performance and safety:

```sql
PRAGMA synchronous = NORMAL;
```

### Cache Size

1MB cache size for optimal performance:

```sql
PRAGMA cache_size = 1000; -- 1MB (1000 pages × 1KB)
```

## Data Characteristics

### Database Size

- **Total Size**: ~42MB
- **Record Count**: ~150,000+ IFSC codes
- **Compression**: SQLite native compression

### Data Coverage

- **Banks**: All major Indian banks
- **Branches**: All active branches
- **States**: All Indian states and union territories
- **Cities**: All major cities and towns

## Query Patterns

### Lookup Query

```sql
SELECT * FROM ifsc_codes WHERE code = ?;
```

**Performance:**
- Uses PRIMARY KEY index
- O(1) lookup time
- Sub-millisecond execution

### Search Queries

#### By Bank

```sql
SELECT * FROM ifsc_codes WHERE bank = ? LIMIT ?;
```

**Performance:**
- Uses `idx_bank` index
- Fast for exact matches
- Slower for LIKE queries

#### By State

```sql
SELECT * FROM ifsc_codes WHERE state = ? LIMIT ?;
```

**Performance:**
- Uses `idx_state` index
- Fast for exact matches

#### By City

```sql
SELECT * FROM ifsc_codes 
WHERE city1 = ? OR city2 = ? 
LIMIT ?;
```

**Performance:**
- Uses `idx_city1` and `idx_city2` indexes
- OR condition may require index merge

#### Combined Search

```sql
SELECT * FROM ifsc_codes 
WHERE bank = ? AND state = ? 
LIMIT ?;
```

**Performance:**
- Uses multiple indexes
- Index intersection for optimal performance

## Prepared Statements

All implementations use prepared statements for optimal performance:

### Python

```python
lookup_stmt = db.prepare('SELECT * FROM ifsc_codes WHERE code = ?')
```

### TypeScript

```typescript
const lookupStmt = db.prepare('SELECT * FROM ifsc_codes WHERE code = ?');
```

**Benefits:**
- Query plan cached
- Parameter binding prevents SQL injection
- Faster execution for repeated queries

## Data Integrity

### Constraints

- **PRIMARY KEY**: `code` column ensures uniqueness
- **NOT NULL**: No explicit NOT NULL constraints (handled in application layer)
- **Validation**: IFSC code format validated before insertion

### Normalization

- **IFSC Codes**: Stored in uppercase
- **Bank Names**: Stored as-is from source
- **Addresses**: Stored as-is from source
- **Cities/States**: Stored in uppercase

## Migration Strategy

### Version Control

Database schema is versioned. Future changes require:

1. Schema migration scripts
2. Data migration scripts
3. Version bump in package
4. Migration guide in documentation

### Backward Compatibility

- New columns added as optional (nullable)
- Existing columns never removed
- Index changes are additive only

## Performance Optimization

### Query Optimization

- **Indexes**: Strategic indexes on search columns
- **Prepared Statements**: Reused query plans
- **WAL Mode**: Concurrent read access
- **Cache Size**: 1MB cache for hot data

### Storage Optimization

- **SQLite Compression**: Native compression
- **Index Optimization**: Balanced index count
- **Vacuum**: Periodic VACUUM for optimal size

## Data Source

The database is populated from official RBI (Reserve Bank of India) IFSC data.

### Update Frequency

- **Initial Load**: Complete database snapshot
- **Updates**: Incremental updates as new branches are added
- **Validation**: Data validated before inclusion

### Data License

- **Source**: RBI IFSC data (public domain)
- **License**: LGPL-2.1 (package license)
- **Attribution**: Copyright © 2024 Akshat Kotpalliwar

