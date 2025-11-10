# Best Practices

This guide covers best practices for using IFSCFinder in your applications.

## Performance Best Practices

### 1. Use Caching

Enable caching for repeated queries:

```python
# Python
from ifscfinder import lookup

# First lookup - database query
details1 = lookup("SBIN0000001")

# Second lookup - cached result (40x faster)
details2 = lookup("SBIN0000001")
```

```typescript
// TypeScript
import { lookup } from 'ifscfinder-ts';

// First lookup - database query
const details1 = lookup('SBIN0000001');

// Second lookup - cached result (40x faster)
const details2 = lookup('SBIN0000001');
```

### 2. Batch Processing

Process multiple IFSC codes in batches:

```python
# Python
from ifscfinder import lookup

ifsc_codes = ["SBIN0000001", "HDFC0000001", "ICIC0000001"]

# First pass - populate cache
for ifsc in ifsc_codes:
    lookup(ifsc)

# Second pass - use cached results
for ifsc in ifsc_codes:
    details = lookup(ifsc)  # Fast cached lookup
```

### 3. Optimize Search Queries

Use specific search parameters:

```python
# Python
from ifscfinder import search

# More specific = faster
results = search(
    {"bank": "HDFC BANK", "state": "MAHARASHTRA", "city": "MUMBAI"},
    limit=10
)
```

## Code Quality Best Practices

### 1. Validate Input

Always validate IFSC codes before using:

```python
# Python
from ifscfinder import normalize_ifsc_code, lookup

ifsc_code = normalize_ifsc_code(user_input)
if ifsc_code:
    details = lookup(ifsc_code)
else:
    print("Invalid IFSC code")
```

```typescript
// TypeScript
import { normalizeIfscCode, lookup } from 'ifscfinder-ts';

const normalized = normalizeIfscCode(userInput);
if (normalized) {
  const details = lookup(normalized);
} else {
  console.log('Invalid IFSC code');
}
```

### 2. Check for Null

Always check for null before using results:

```python
# Python
from ifscfinder import lookup

details = lookup("SBIN0000001")
if details:
    print(details["BANK"])
else:
    print("Not found")
```

```typescript
// TypeScript
import { lookup } from 'ifscfinder-ts';

const details = lookup('SBIN0000001');
if (details) {
  console.log(details.BANK);
} else {
  console.log('Not found');
}
```

### 3. Use Helper Functions

Helper functions handle null checks:

```python
# Python
from ifscfinder import ifsc_to_bank

bank = ifsc_to_bank("SBIN0000001")
if bank:
    print(bank)
```

```typescript
// TypeScript
import { ifscToBank } from 'ifscfinder-ts';

const bank = ifscToBank('SBIN0000001');
if (bank) {
  console.log(bank);
}
```

## Security Best Practices

### 1. Input Validation

Always validate user input:

```python
# Python
from ifscfinder import normalize_ifsc_code, lookup

def safe_lookup(user_input: str):
    # Normalize and validate
    ifsc_code = normalize_ifsc_code(user_input)
    if not ifsc_code:
        return None
    
    # Lookup
    return lookup(ifsc_code)
```

### 2. SQL Injection Prevention

Prepared statements prevent SQL injection:

```python
# Python
# IFSCFinder uses prepared statements internally
# No need to worry about SQL injection
details = lookup(user_input)  # Safe
```

### 3. Error Message Sanitization

Don't expose internal errors:

```python
# Python
def safe_lookup(ifsc_code: str):
    try:
        details = lookup(ifsc_code)
        if details:
            return details
        else:
            return {"error": "IFSC code not found"}
    except Exception:
        # Don't expose internal errors
        return {"error": "Lookup failed"}
```

## Integration Best Practices

### 1. FastAPI Integration

```python
from fastapi import FastAPI, HTTPException
from ifscfinder import lookup

app = FastAPI()

@app.get("/ifsc/{ifsc_code}")
async def get_ifsc_details(ifsc_code: str):
    details = lookup(ifsc_code)
    if not details:
        raise HTTPException(status_code=404, detail="IFSC code not found")
    return details
```

### 2. Express.js Integration

```typescript
import express from 'express';
import { lookup } from 'ifscfinder-ts';

const app = express();

app.get('/ifsc/:ifscCode', (req, res) => {
  const details = lookup(req.params.ifscCode);
  if (!details) {
    return res.status(404).json({ error: 'IFSC code not found' });
  }
  res.json(details);
});
```

### 3. Middleware Pattern

```python
# Python
from ifscfinder import lookup

def validate_ifsc_middleware(ifsc_code: str) -> bool:
    """Validate IFSC code format and existence."""
    if not ifsc_code or len(ifsc_code) != 11:
        return False
    return lookup(ifsc_code) is not None
```

## Testing Best Practices

### 1. Use Test Fixtures

Use consistent test fixtures:

```python
# Python
TEST_IFSCS = [
    "SBIN0000001",
    "HDFC0000001",
    "ICIC0000001",
]

def test_lookup():
    for ifsc in TEST_IFSCS:
        details = lookup(ifsc)
        assert details is not None
```

### 2. Test Error Cases

Test error handling:

```python
# Python
def test_lookup_invalid():
    details = lookup("INVALID123")
    assert details is None
```

### 3. Test Performance

Test performance targets:

```python
# Python
import time

def test_lookup_performance():
    start = time.time()
    for _ in range(1000):
        lookup("SBIN0000001")
    elapsed = time.time() - start
    assert elapsed < 0.1  # < 0.1ms per lookup
```

## Documentation Best Practices

### 1. Document Usage

Document how to use IFSCFinder:

```python
# Python
"""
Lookup IFSC code details.

Args:
    ifsc_code: 11-character IFSC code

Returns:
    Dictionary with IFSC details or None if not found

Example:
    >>> details = lookup("SBIN0000001")
    >>> print(details["BANK"])
    STATE BANK OF INDIA
"""
```

### 2. Document Examples

Provide usage examples:

```python
# Python
# Example: Validate IFSC code
def is_valid_ifsc(ifsc_code: str) -> bool:
    return lookup(ifsc_code) is not None
```

### 3. Document Performance

Document performance characteristics:

```python
# Python
"""
Performance:
- Uncached lookup: ~0.01ms per query
- Cached lookup: ~0.0004ms per query
- Throughput: 136,845 lookups/second (uncached)
"""
```

## Deployment Best Practices

### 1. Database Location

Ensure database is accessible:

```python
# Python
from ifscfinder import IFSCDatabase

# Use custom database path if needed
db = IFSCDatabase(db_path="/path/to/ifsc.db")
```

### 2. Cache Configuration

Configure cache size based on usage:

```python
# Python
from ifscfinder import get_cache

# Larger cache for high-throughput applications
cache = get_cache(size=2048)
```

### 3. Error Monitoring

Monitor errors in production:

```python
# Python
import logging

logger = logging.getLogger(__name__)

def monitored_lookup(ifsc_code: str):
    details = lookup(ifsc_code)
    if not details:
        logger.warning(f"IFSC code not found: {ifsc_code}")
    return details
```

## Maintenance Best Practices

### 1. Update Database

Keep database up to date:

```python
# Python
# Replace database file with updated version
# Clear cache after update
from ifscfinder import clear_cache

clear_cache()  # Clear cache after database update
```

### 2. Monitor Performance

Monitor performance in production:

```python
# Python
import time

def monitored_lookup(ifsc_code: str):
    start = time.time()
    details = lookup(ifsc_code)
    elapsed = time.time() - start
    
    if elapsed > 0.1:  # Log slow lookups
        logger.warning(f"Slow lookup: {ifsc_code} took {elapsed}ms")
    
    return details
```

### 3. Version Management

Keep package versions up to date:

```bash
# Python
pip install --upgrade ifscfinder

# TypeScript
npm update ifscfinder-ts
```

