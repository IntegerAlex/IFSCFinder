# Examples

Real-world examples of using IFSCFinder in your applications.

## Python Examples

### Basic Lookup

```python
from ifscfinder import lookup

details = lookup("SBIN0000001")
if details:
    print(f"Bank: {details['BANK']}")
    print(f"Branch: {details['BRANCH']}")
    print(f"Address: {details['ADDRESS']}")
    print(f"City: {details['CITY1']}")
    print(f"State: {details['STATE']}")
```

### Field-Specific Helpers

```python
from ifscfinder import (
    ifsc_to_bank,
    ifsc_to_branch,
    ifsc_to_address,
    ifsc_to_state
)

ifsc = "HDFC0000001"

print(f"Bank: {ifsc_to_bank(ifsc)}")
print(f"Branch: {ifsc_to_branch(ifsc)}")
print(f"Address: {ifsc_to_address(ifsc)}")
print(f"State: {ifsc_to_state(ifsc)}")
```

### Search by Bank

```python
from ifscfinder import search

# Find all HDFC Bank branches
results = search({"bank": "HDFC BANK"}, limit=50)

for result in results:
    print(f"{result['CODE']}: {result['BRANCH']}, {result['CITY1']}")
```

### Search by State

```python
from ifscfinder import search

# Find all branches in Maharashtra
results = search({"state": "MAHARASHTRA"}, limit=100)

print(f"Found {len(results)} branches in Maharashtra")
```

### Combined Search

```python
from ifscfinder import search

# Find HDFC Bank branches in Mumbai
results = search(
    {"bank": "HDFC BANK", "city": "MUMBAI"},
    limit=20
)

for result in results:
    print(f"{result['CODE']}: {result['BRANCH']}")
```

### Cache Management

```python
from ifscfinder import lookup, clear_lookup_cache

# Lookup with caching
details1 = lookup("SBIN0000001")  # Database query
details2 = lookup("SBIN0000001")  # Cached result

# Clear cache when database is updated
clear_lookup_cache()
```

## TypeScript Examples

### Basic Lookup

```typescript
import { lookup } from 'ifscfinder-ts';

const details = lookup('SBIN0000001');
if (details) {
  console.log(`Bank: ${details.BANK}`);
  console.log(`Branch: ${details.BRANCH}`);
  console.log(`Address: ${details.ADDRESS}`);
  console.log(`City: ${details.CITY1}`);
  console.log(`State: ${details.STATE}`);
}
```

### Field-Specific Helpers

```typescript
import {
  ifscToBank,
  ifscToBranch,
  ifscToAddress,
  ifscToState
} from 'ifscfinder-ts';

const ifsc = 'HDFC0000001';

console.log(`Bank: ${ifscToBank(ifsc)}`);
console.log(`Branch: ${ifscToBranch(ifsc)}`);
console.log(`Address: ${ifscToAddress(ifsc)}`);
console.log(`State: ${ifscToState(ifsc)}`);
```

### Search with Options

```typescript
import { search } from 'ifscfinder-ts';

// Exact match
const exactResults = search(
  { bank: 'STATE BANK OF INDIA' },
  { exact: true, limit: 50 }
);

// Partial match
const partialResults = search(
  { bank: 'HDFC' },
  { exact: false, limit: 50 }
);
```

### Batch Processing

```typescript
import { lookup } from 'ifscfinder-ts';

const ifscCodes = ['SBIN0000001', 'HDFC0000001', 'ICIC0000001'];

const results = ifscCodes.map(ifsc => {
  const details = lookup(ifsc);
  return {
    ifsc,
    bank: details?.BANK || 'Not found',
    branch: details?.BRANCH || 'Not found'
  };
});

console.table(results);
```

## Integration Examples

### FastAPI Endpoint

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

### Express.js Endpoint

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

app.listen(3000);
```

### Validation Middleware

```python
from ifscfinder import lookup

def validate_ifsc(ifsc_code: str) -> bool:
    """Validate IFSC code format and existence."""
    if not ifsc_code or len(ifsc_code) != 11:
        return False
    return lookup(ifsc_code) is not None
```

## Performance Tips

### Use Caching

The library automatically caches lookup results. For repeated queries, subsequent lookups will be much faster.

### Batch Processing

For processing multiple IFSC codes, process them in batches to take advantage of caching:

```python
from ifscfinder import lookup

ifsc_codes = ["SBIN0000001", "HDFC0000001", "ICIC0000001"]

# First pass - populate cache
for ifsc in ifsc_codes:
    lookup(ifsc)

# Second pass - use cached results
for ifsc in ifsc_codes:
    details = lookup(ifsc)  # Fast cached lookup
```

### Search Optimization

Use specific search parameters to reduce result sets:

```python
from ifscfinder import search

# More specific = faster
results = search(
    {"bank": "HDFC BANK", "state": "MAHARASHTRA", "city": "MUMBAI"},
    limit=10
)
```

