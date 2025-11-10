# Quick Start

Get started with IFSCFinder in minutes. This guide will show you how to perform basic IFSC lookups.

## Python

### Basic Lookup

```python
from ifscfinder import lookup, ifsc_to_bank

# Lookup full details
details = lookup("SBIN0000001")
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

# Get just the bank name
bank = ifsc_to_bank("HDFC0000001")
print(bank)  # 'HDFC BANK'
```

### Search

```python
from ifscfinder import search

# Search by bank and state
results = search(
    {"bank": "HDFC BANK", "state": "MAHARASHTRA"},
    limit=10
)

for result in results:
    print(result["CODE"], result["BRANCH"])
```

## TypeScript

### Basic Lookup

```typescript
import { lookup, ifscToBank } from 'ifscfinder-ts';

// Lookup full details
const details = lookup('SBIN0000001');
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

// Get just the bank name
const bank = ifscToBank('HDFC0000001');
console.log(bank); // 'HDFC BANK'
```

### Search

```typescript
import { search } from 'ifscfinder-ts';

// Search by bank and state
const results = search(
  { bank: 'HDFC BANK', state: 'MAHARASHTRA' },
  { limit: 10 }
);

results.forEach(result => {
  console.log(result.CODE, result.BRANCH);
});
```

## Common Use Cases

### Validate IFSC Code

```python
from ifscfinder import lookup

def is_valid_ifsc(ifsc_code):
    return lookup(ifsc_code) is not None

print(is_valid_ifsc("SBIN0000001"))  # True
print(is_valid_ifsc("INVALID123"))   # False
```

### Get Bank Information

```python
from ifscfinder import ifsc_to_bank, ifsc_to_branch, ifsc_to_state

ifsc = "ICIC0000001"
print(f"Bank: {ifsc_to_bank(ifsc)}")
print(f"Branch: {ifsc_to_branch(ifsc)}")
print(f"State: {ifsc_to_state(ifsc)}")
```

### Batch Processing

```python
from ifscfinder import lookup

ifsc_codes = ["SBIN0000001", "HDFC0000001", "ICIC0000001"]

for ifsc in ifsc_codes:
    details = lookup(ifsc)
    if details:
        print(f"{ifsc}: {details['BANK']}")
```

## Next Steps

- Read the [API Reference](/docs/api/overview) for detailed function documentation
- Check out [Examples](/docs/getting-started/examples) for more use cases
- Learn about [Architecture](/docs/architecture/overview) to understand how it works

