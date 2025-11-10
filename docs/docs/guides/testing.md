# Testing

IFSCFinder includes comprehensive tests to ensure reliability and API parity across all implementations.

## Test Structure

### Python Tests

```
python/tests/
├── test_lookup.py
├── test_search.py
├── test_cache.py
└── test_performance.py
```

### TypeScript Tests

```
clients/typescript/tests/
├── lookup.spec.ts
├── search.spec.ts
└── cache.spec.ts
```

## Running Tests

### Python

```bash
cd python
pytest
```

### TypeScript

```bash
cd clients/typescript
npm test
```

## Test Categories

### Unit Tests

Test individual functions in isolation:

```python
def test_lookup():
    details = lookup("SBIN0000001")
    assert details is not None
    assert details["BANK"] == "STATE BANK OF INDIA"
```

### Integration Tests

Test with real database:

```python
def test_lookup_integration():
    db = IFSCDatabase()
    details = db.lookup("SBIN0000001")
    assert details is not None
```

### Performance Tests

Test performance targets:

```python
def test_lookup_performance():
    start = time.time()
    for _ in range(1000):
        lookup("SBIN0000001")
    elapsed = time.time() - start
    assert elapsed < 0.1  # < 0.1ms per lookup
```

### Parity Tests

Test API parity across implementations:

```python
def test_python_typescript_parity():
    python_result = lookup("SBIN0000001")
    # Compare with TypeScript result
    assert python_result == typescript_result
```

## Test Fixtures

### Test IFSC Codes

All implementations use the same test fixtures:

```python
TEST_IFSCS = [
    "SBIN0000001",  # State Bank of India
    "HDFC0000001",  # HDFC Bank
    "ICIC0000001",  # ICICI Bank
    "AXIS0000001",  # Axis Bank
    "KKBK0000001",  # Kotak Mahindra Bank
]
```

## Test Coverage

### Coverage Requirements

- **Unit Tests**: 100% function coverage
- **Integration Tests**: All database operations
- **Performance Tests**: All performance targets
- **Parity Tests**: All API functions

### Running Coverage

```bash
# Python
cd python
pytest --cov=src/ifscfinder --cov-report=html

# TypeScript
cd clients/typescript
npm run test:coverage
```

## Test Best Practices

### 1. Test Isolation

Each test should be independent:

```python
def test_lookup():
    # Clear cache before test
    clear_cache()
    details = lookup("SBIN0000001")
    assert details is not None
```

### 2. Test Data

Use consistent test data:

```python
VALID_IFSC = "SBIN0000001"
INVALID_IFSC = "INVALID123"
```

### 3. Test Assertions

Use clear assertions:

```python
def test_lookup():
    details = lookup("SBIN0000001")
    assert details is not None
    assert details["BANK"] == "STATE BANK OF INDIA"
    assert details["BRANCH"] == "KOLKATA MAIN"
```

### 4. Test Error Cases

Test error handling:

```python
def test_lookup_invalid():
    details = lookup("INVALID123")
    assert details is None
```

## Continuous Integration

### GitHub Actions

All implementations include CI workflows:

- **Python**: `.github/workflows/python-ci.yml`
- **TypeScript**: `.github/workflows/ci.yml`

### CI Steps

1. **Install Dependencies**
2. **Run Tests**
3. **Check Code Quality**
4. **Run Performance Benchmarks**
5. **Build Package**

## Performance Testing

### Benchmark Suite

All implementations include benchmark suites:

```python
def test_lookup_benchmark():
    start = time.time()
    for _ in range(1000):
        lookup("SBIN0000001")
    elapsed = time.time() - start
    avg_time = elapsed / 1000
    assert avg_time < 0.1  # < 0.1ms per lookup
```

### Performance Targets

All implementations must meet:

- **Uncached lookup**: < 0.1ms per query
- **Cached lookup**: < 0.001ms per query
- **Throughput**: 100K+ lookups/second (uncached)

## Test Maintenance

### Updating Tests

When updating code:

1. Update tests to match new behavior
2. Add tests for new features
3. Remove tests for removed features
4. Update test fixtures if needed

### Test Review

During code review:

1. Check test coverage
2. Verify test assertions
3. Review test performance
4. Ensure test parity

