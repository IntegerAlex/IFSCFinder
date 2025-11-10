# Cross-Platform Architecture

IFSCFinder maintains strict API parity across all supported languages while leveraging language-specific optimizations.

## Platform Support

### Current Implementations

- **Python**: Canonical implementation (reference)
- **TypeScript**: Node.js implementation
- **Go**: Planned
- **Rust**: Planned

### Platform Characteristics

| Platform | Runtime | Database | Caching | Status |
|----------|---------|----------|---------|--------|
| **Python** | CPython | SQLite3 | LRU Cache | ✅ Production |
| **TypeScript** | Node.js | better-sqlite3 | LRU Cache | ✅ Production |
| **Go** | Go | sqlite3 | LRU Cache | 🚧 Planned |
| **Rust** | Rust | rusqlite | LRU Cache | 🚧 Planned |

## API Parity

### Function Signatures

All implementations provide identical function signatures:

#### Lookup

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

### Return Types

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

### Error Handling

All implementations follow the same error handling pattern:

- **Invalid input**: Returns `null` (or equivalent)
- **Not found**: Returns `null` (or equivalent)
- **Database errors**: Returns `null` (or equivalent)

## Shared Components

### Database Schema

All implementations use the same SQLite schema:

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

### Validation Rules

All implementations use the same validation rules:

1. **Length**: Exactly 11 characters
2. **Format**: Alphanumeric (A-Z, 0-9)
3. **Case**: Case-insensitive (normalized to uppercase)
4. **Whitespace**: Trimmed before validation

### Caching Strategy

All implementations use the same caching strategy:

- **Type**: LRU (Least Recently Used)
- **Size**: Configurable (default: 1024 entries)
- **Scope**: Per-process singleton
- **Performance**: 40x speedup for cached lookups

## Language-Specific Optimizations

### Python

- **Database**: Built-in `sqlite3` module
- **Caching**: `collections.OrderedDict` for LRU
- **Performance**: CPython optimizations
- **Packaging**: setuptools with src layout

### TypeScript

- **Database**: `better-sqlite3` (native bindings)
- **Caching**: `Map` with manual LRU implementation
- **Performance**: V8 optimizations
- **Packaging**: npm with ESM + CJS support

### Go (Planned)

- **Database**: `github.com/mattn/go-sqlite3`
- **Caching**: Custom LRU implementation
- **Performance**: Native compilation
- **Packaging**: Go modules

### Rust (Planned)

- **Database**: `rusqlite` crate
- **Caching**: Custom LRU implementation
- **Performance**: Zero-cost abstractions
- **Packaging**: Cargo

## Performance Parity

All implementations target the same performance goals:

- **Uncached lookup**: < 0.1ms per query
- **Cached lookup**: < 0.001ms per query
- **Throughput**: 100K+ lookups/second (uncached)

### Actual Performance

| Platform | Uncached | Cached | Speedup |
|----------|----------|--------|---------|
| **Python** | 0.01ms | 0.00ms | 40.4x |
| **TypeScript** | 0.015ms | 0.0004ms | 37.5x |
| **Go** | TBD | TBD | TBD |
| **Rust** | TBD | TBD | TBD |

## Testing Parity

### Shared Test Fixtures

All implementations use the same test fixtures:

```python
# Test IFSC codes
TEST_IFSCS = [
    "SBIN0000001",  # State Bank of India
    "HDFC0000001",  # HDFC Bank
    "ICIC0000001",  # ICICI Bank
]
```

### Validation Tests

All implementations pass the same validation tests:

1. **Normalization tests**: Valid/invalid inputs
2. **Lookup tests**: Found/not found cases
3. **Helper function tests**: Field extraction
4. **Cache tests**: Cache behavior
5. **Search tests**: Search functionality

## Documentation Parity

### API Documentation

All implementations have:
- Same function signatures
- Same parameter descriptions
- Same return type specifications
- Same example code

### Architecture Documentation

All implementations share:
- Same database schema
- Same caching strategy
- Same performance characteristics
- Same security considerations

## Deployment Parity

### Package Distribution

All implementations are distributed via:
- **Python**: PyPI
- **TypeScript**: npm
- **Go**: Go modules (planned)
- **Rust**: crates.io (planned)

### Versioning

All implementations follow:
- Semantic versioning (SemVer)
- Synchronized version numbers
- Shared changelog
- Coordinated releases

## Migration Between Platforms

### Code Migration

Migrating between platforms is straightforward:

**Python to TypeScript:**
```python
# Python
from ifscfinder import lookup
details = lookup("SBIN0000001")
```

```typescript
// TypeScript
import { lookup } from 'ifscfinder-ts';
const details = lookup('SBIN0000001');
```

### Data Migration

All implementations use the same database format:
- Same SQLite schema
- Same data structure
- Same validation rules
- Same performance characteristics

## Future Platforms

### Planned Implementations

- **Go**: High-performance server-side implementation
- **Rust**: Zero-cost abstractions for maximum performance
- **Browser**: WebAssembly SQLite for browser environments

### Platform Requirements

New platforms must:
1. Maintain API parity
2. Meet performance targets
3. Pass validation tests
4. Follow architecture guidelines
5. Provide comprehensive documentation

## Cross-Platform Testing

### Parity Tests

All implementations include parity tests:

```python
# Python parity test
def test_python_typescript_parity():
    python_result = lookup("SBIN0000001")
    # Compare with TypeScript result
    assert python_result == typescript_result
```

### Performance Tests

All implementations include performance tests:

```python
# Performance benchmark
def test_lookup_performance():
    start = time.time()
    for _ in range(1000):
        lookup("SBIN0000001")
    elapsed = time.time() - start
    assert elapsed < 0.1  # < 0.1ms per lookup
```

## Best Practices

### API Design

1. **Consistency**: Same API across all platforms
2. **Simplicity**: Easy to use and remember
3. **Performance**: Fast and efficient
4. **Reliability**: Robust error handling

### Implementation

1. **Parity First**: Maintain API parity above all
2. **Language Idioms**: Use language-specific optimizations
3. **Performance**: Meet performance targets
4. **Testing**: Comprehensive test coverage

### Documentation

1. **Consistency**: Same documentation structure
2. **Examples**: Language-specific examples
3. **Migration**: Clear migration guides
4. **Performance**: Platform-specific benchmarks

