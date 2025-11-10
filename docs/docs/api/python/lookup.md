# Python API - Lookup

## `lookup(ifsc_code: str) -> dict | None`

Lookup IFSC code details with caching.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code (case-insensitive)

### Returns

- **`dict | None`**: Dictionary containing IFSC details or `None` if not found/invalid

### Example

```python
from ifscfinder import lookup

details = lookup("SBIN0000001")
if details:
    print(details)
    # {
    #   'CODE': 'SBIN0000001',
    #   'BANK': 'STATE BANK OF INDIA',
    #   'BRANCH': 'KOLKATA MAIN',
    #   'ADDRESS': 'SAMRIDDHI BHAWAN, 1 STRAND ROAD, KOLKATA 700 001',
    #   'CITY1': 'KOLKATA',
    #   'CITY2': 'KOLKATA',
    #   'STATE': 'WEST BENGAL'
    # }
```

### Field Names

All field names are **UPPERCASE** to maintain parity with the database schema:

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

- Invalid IFSC code (wrong length, non-alphanumeric): Returns `None`
- IFSC code not found: Returns `None`
- Database errors: Returns `None` (graceful degradation)

### Performance

- **Uncached**: ~0.01ms per lookup
- **Cached**: ~0.0004ms per lookup
- **Throughput**: 136,845 lookups/second (uncached), 5.5M/second (cached)

