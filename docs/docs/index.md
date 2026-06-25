# IFSCFinder

Find any IFSC code instantly. IFSCFinder is a high-performance IFSC code lookup library for Python and TypeScript — zero dependencies, sub-millisecond queries, 185,000+ bank branches indexed.

---

## What is an IFSC Code?

IFSC (Indian Financial System Code) is an 11-character alphanumeric code that uniquely identifies a bank branch in India. It's used for NEFT, RTGS, and IMPS fund transfers. The format is `AAAA0BBBBBB` — first 4 characters identify the bank, 5th is always `0`, last 6 identify the branch.

## How to Find IFSC Code

**Using IFSCFinder:**

```python
from ifscfinder import lookup

# Find IFSC code details
details = lookup("SBIN0000001")
print(details["BANK"])    # "STATE BANK OF INDIA"
print(details["BRANCH"])  # "KOLKATA MAIN"
print(details["ADDRESS"]) # Full address
print(details["STATE"])   # "WEST BENGAL"
```

```typescript
import { lookup } from 'ifscfinder-ts';

const details = lookup('SBIN0000001');
console.log(details!.BANK);
console.log(details!.BRANCH);
```

## Installation

**Python** (Python >= 3.7, zero dependencies):

```bash
pip install ifscfinder
```

**TypeScript** (Node.js >= 18):

```bash
npm install ifscfinder-ts
```

---

## API Reference

### lookup(ifsc)

Returns full branch details for an IFSC code, or `null` if not found.

| Param | Type | Description |
|-------|------|-------------|
| `ifsc` | `string` | 11-character IFSC code (case-insensitive) |

**Returns:** `IfscDetails` — `CODE`, `BANK`, `BRANCH`, `ADDRESS`, `CITY1`, `CITY2`, `STATE`, `STD_CODE`. Null fields omitted.

```python
details = lookup("SBIN0000001")
print(details["BANK"])    # "STATE BANK OF INDIA"
print(details["BRANCH"])  # "KOLKATA MAIN"
```

```typescript
const details = lookup('SBIN0000001');
console.log(details!.BANK);
```

### Helper Functions

| Python | TypeScript | Returns |
|--------|------------|---------|
| `ifsc_to_bank(ifsc)` | `ifscToBank(ifsc)` | Bank name |
| `ifsc_to_branch(ifsc)` | `ifscToBranch(ifsc)` | Branch name |
| `ifsc_to_address(ifsc)` | `ifscToAddress(ifsc)` | Full address |
| `ifsc_to_city1(ifsc)` | `ifscToCity1(ifsc)` | City |
| `ifsc_to_city2(ifsc)` | `ifscToCity2(ifsc)` | Second city/location |
| `ifsc_to_state(ifsc)` | `ifscToState(ifsc)` | State |
| `ifsc_to_std_code(ifsc)` | `ifscToStdCode(ifsc)` | STD code |

```python
bank = ifsc_to_bank("SBIN0000001")     # "STATE BANK OF INDIA"
branch = ifsc_to_branch("SBIN0000001") # "KOLKATA MAIN"
state = ifsc_to_state("SBIN0000001")   # "WEST BENGAL"
```

```typescript
const bank = ifscToBranch('SBIN0000001');
```

### search(params, options?)

Search IFSC codes by bank, city, state, or any combination. Case-insensitive.

| Param | Type | Description |
|-------|------|-------------|
| `bank` | `string` | Bank name |
| `branch` | `string` | Branch name |
| `city` | `string` | City |
| `state` | `string` | State |

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `exact` | `bool` | `true` | Exact match (`false` = LIKE search) |
| `limit` | `int` | `100` | Max results |

```python
# All SBI branches in Karnataka
results = search({"bank": "STATE BANK OF INDIA", "state": "KARNATAKA"}, limit=10)

# Partial search
results = search({"bank": "HDFC"}, exact=False, limit=5)
```

```typescript
const results = search({ state: 'KARNATAKA' }, { limit: 5 });
```

### clear_lookup_cache()

Clear the in-memory LRU cache (1024 entries, ~40x speedup).

```python
from ifscfinder import clear_lookup_cache
clear_lookup_cache()
```

```typescript
import { clearCache } from 'ifscfinder-ts';
clearCache();
```

---

## Data

The bundled SQLite database (`data/ifsc.db`, ~46 MB) contains **185,000+ IFSC records** across 286 Indian banks — SBI, HDFC, ICICI, Canara, PNB, Bank of Baroda, Axis, Kotak, Yes Bank, and more.

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

Indexed on `code`, `bank`, `state`, `city1` for fast queries. Uses WAL mode for concurrent reads.

**Source:** Official RBI master data.

---

## Performance

| Operation | Python | TypeScript |
|-----------|--------|------------|
| Lookup (uncached) | ~0.01 ms | ~0.015 ms |
| Lookup (cached) | ~0.0004 ms | ~0.0004 ms |
| Throughput (uncached) | 136K/s | 66K/s |
| Throughput (cached) | 5.5M/s | 2.5M/s |

---

## Error Handling

All functions return `null` on invalid input or lookup failure — never throw.

```python
result = lookup("INVALID123")
if result is None:
    print("IFSC code not found")
```

---

## Development

```bash
# Python
cd python && pip install -e ".[dev]" && pytest

# TypeScript
cd clients/typescript && pnpm install && pnpm vitest
```

---

## License

LGPL-2.1. Copyright (c) 2024 [Akshat Kotpalliwar](https://www.akshatkotpalliwar.in/).
