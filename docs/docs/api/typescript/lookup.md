# TypeScript API - Lookup

## `lookup(ifscCode: string): IfscDetails | null`

Lookup IFSC code details with caching.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code (case-insensitive)

### Returns

- **`IfscDetails | null`**: Object containing IFSC details or `null` if not found/invalid

### Type Definition

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

### Example

```typescript
import { lookup } from 'ifscfinder-ts';

const details = lookup('SBIN0000001');
if (details) {
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
}
```

### Field Names

All field names are **UPPERCASE** to maintain parity with Python implementation:

- `CODE` - IFSC code
- `BANK` - Bank name
- `BRANCH` - Branch name
- `ADDRESS` - Full address
- `CITY1` - Primary city
- `CITY2` - Secondary city
- `STATE` - State name
- `STD_CODE` - STD code (optional)

### Null Handling

Fields with null or empty values are omitted from the result (Python parity).

### Caching

Results are automatically cached. Subsequent lookups for the same IFSC code will use the cache.

### Error Handling

- Invalid IFSC code (wrong length, non-alphanumeric): Returns `null`
- IFSC code not found: Returns `null`
- Database errors: Returns `null` (graceful degradation)

### Performance

- **Uncached**: ~0.015ms per lookup
- **Cached**: ~0.0004ms per lookup
- **Throughput**: 66,000 lookups/second (uncached), 2.5M/second (cached)

