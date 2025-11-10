# API Contracts

This document defines the API contract specifications that all IFSCFinder implementations must follow.

## Core Principles

1. **API Parity**: All language implementations must provide the same API surface
2. **Consistent Behavior**: Same inputs produce same outputs across languages
3. **Error Handling**: Consistent error handling patterns
4. **Performance**: All implementations target the same performance goals

## Function Signatures

### Lookup Functions

All implementations must provide these functions:

#### `lookup(ifscCode: string) -> IfscDetails | null`

**Python:**
```python
def lookup(ifsc_code: str) -> dict | None:
    ...
```

**TypeScript:**
```typescript
function lookup(ifscCode: string): IfscDetails | null {
  ...
}
```

**Go:**
```go
func Lookup(ifscCode string) (*IfscDetails, error) {
  ...
}
```

**Rust:**
```rust
pub fn lookup(ifsc_code: &str) -> Option<IfscDetails> {
  ...
}
```

### Helper Functions

All implementations must provide these helper functions:

- `ifscToBank(ifscCode: string) -> string | null`
- `ifscToBranch(ifscCode: string) -> string | null`
- `ifscToAddress(ifscCode: string) -> string | null`
- `ifscToCity1(ifscCode: string) -> string | null`
- `ifscToCity2(ifscCode: string) -> string | null`
- `ifscToState(ifscCode: string) -> string | null`
- `ifscToStdCode(ifscCode: string) -> string | null`

### Search Functions

All implementations must provide:

- `search(params: SearchParams, options?: SearchOptions) -> IfscDetails[]`

### Utility Functions

All implementations must provide:

- `normalizeIfscCode(code: string) -> string | null`
- `clearCache() -> void`

## Return Types

### IfscDetails

All implementations must return the same structure:

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

**Field Naming Rules:**
- All field names must be **UPPERCASE**
- Field names must match exactly across languages
- Optional fields (like STD_CODE) must be omitted if null/empty

### Null Handling

All implementations must:
- Omit fields with null or empty values
- Return `null` (or equivalent) for invalid inputs
- Return `null` (or equivalent) for not found

## Validation Rules

### IFSC Code Validation

All implementations must validate IFSC codes using these rules:

1. **Length**: Must be exactly 11 characters
2. **Format**: Must be alphanumeric (A-Z, 0-9)
3. **Case**: Case-insensitive (normalized to uppercase)
4. **Whitespace**: Trimmed before validation

### Normalization

All implementations must normalize IFSC codes:

```python
def normalize_ifsc_code(code: str) -> str | None:
    if not code:
        return None
    trimmed = code.strip().upper()
    if len(trimmed) != 11 or not trimmed.isalnum():
        return None
    return trimmed
```

## Error Handling

### Invalid Input

All implementations must return `null` (or equivalent) for:
- Empty or null input
- Wrong length (not 11 characters)
- Non-alphanumeric characters

### Not Found

All implementations must return `null` (or equivalent) when:
- IFSC code is valid but not found in database

### Database Errors

All implementations must:
- Return `null` (or equivalent) on database errors
- Not throw exceptions for database errors
- Log errors internally (optional)

## Performance Requirements

All implementations must target:

- **Uncached lookup**: < 0.1ms per query
- **Cached lookup**: < 0.001ms per query
- **Throughput**: 100K+ lookups/second (uncached)

## Caching Behavior

All implementations must:
- Use LRU cache with configurable size (default: 1024)
- Cache both found and not-found results
- Provide `clearCache()` function
- Cache normalized IFSC codes

## Search Behavior

All implementations must:
- Support search by bank, branch, city, state
- Support exact and partial (LIKE) matching
- Support result limiting
- Return empty array for empty search params
- Be case-insensitive

## Database Schema

All implementations must use the same database schema:

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

CREATE INDEX idx_bank ON ifsc_codes(bank);
CREATE INDEX idx_state ON ifsc_codes(state);
CREATE INDEX idx_city1 ON ifsc_codes(city1);
```

## Versioning

API contracts are versioned. Breaking changes require:
- Major version bump
- Migration guide
- Deprecation period

## Testing

All implementations must:
- Use the same test fixtures
- Pass the same validation tests
- Meet the same performance benchmarks
- Maintain API parity tests

