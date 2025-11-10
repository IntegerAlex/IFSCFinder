# Python API - Search

## `search(params: dict, options: dict = None) -> list`

Search for IFSC codes by bank, branch, city, or state.

### Parameters

- **`params`** (dict): Search criteria
  - `bank` (str, optional): Bank name
  - `branch` (str, optional): Branch name
  - `city` (str, optional): City name
  - `state` (str, optional): State name

- **`options`** (dict, optional): Search options
  - `limit` (int, optional): Maximum results (default: 100)
  - `exact` (bool, optional): Exact match vs LIKE search (default: True)

### Returns

- **`list`**: List of matching IFSC details dictionaries

### Examples

#### Search by Bank

```python
from ifscfinder import search

# Exact match
results = search({"bank": "STATE BANK OF INDIA"}, limit=10)

for result in results:
    print(result["CODE"], result["BRANCH"])
```

#### Search by State

```python
from ifscfinder import search

# Find all branches in Maharashtra
results = search({"state": "MAHARASHTRA"}, limit=50)

print(f"Found {len(results)} branches")
```

#### Partial Match

```python
from ifscfinder import search

# Partial match (LIKE search)
results = search(
    {"bank": "HDFC"},
    {"exact": False, limit: 20}
)

for result in results:
    print(result["BANK"], result["BRANCH"])
```

#### Combined Search

```python
from ifscfinder import search

# Search by bank and state
results = search(
    {"bank": "HDFC BANK", "state": "MAHARASHTRA"},
    {"limit": 10}
)

for result in results:
    print(f"{result['CODE']}: {result['BRANCH']}, {result['CITY1']}")
```

#### Search by City

```python
from ifscfinder import search

# Find all branches in Mumbai
results = search({"city": "MUMBAI"}, limit=100)

for result in results:
    print(f"{result['CODE']}: {result['BANK']} - {result['BRANCH']}")
```

### Search Options

#### Limit

Control the maximum number of results:

```python
# Get top 10 results
results = search({"bank": "ICICI BANK"}, {"limit": 10})
```

#### Exact vs Partial Match

```python
# Exact match (default)
results = search({"bank": "HDFC BANK"}, {"exact": True})

# Partial match (LIKE search)
results = search({"bank": "HDFC"}, {"exact": False})
```

### Performance

Search performance depends on:

- **Number of filters**: More filters = faster (smaller result set)
- **Index usage**: Searches on indexed columns are faster
- **Result limit**: Smaller limits = faster queries

### Notes

- Empty search params return empty list
- All searches are case-insensitive
- City search checks both CITY1 and CITY2 fields
- Results are ordered by relevance (exact matches first)

