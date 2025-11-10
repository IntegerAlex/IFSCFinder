# Python API - Helper Functions

Convenience functions for extracting specific fields from IFSC codes.

## `ifsc_to_bank(ifsc_code: str) -> str | None`

Get bank name for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: Bank name or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_bank

bank = ifsc_to_bank("SBIN0000001")
print(bank)  # 'STATE BANK OF INDIA'
```

## `ifsc_to_branch(ifsc_code: str) -> str | None`

Get branch name for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: Branch name or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_branch

branch = ifsc_to_branch("SBIN0000001")
print(branch)  # 'KOLKATA MAIN'
```

## `ifsc_to_address(ifsc_code: str) -> str | None`

Get address for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: Address or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_address

address = ifsc_to_address("SBIN0000001")
print(address)  # 'SAMRIDDHI BHAWAN, 1 STRAND ROAD, KOLKATA 700 001'
```

## `ifsc_to_city1(ifsc_code: str) -> str | None`

Get primary city for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: Primary city or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_city1

city = ifsc_to_city1("SBIN0000001")
print(city)  # 'KOLKATA'
```

## `ifsc_to_city2(ifsc_code: str) -> str | None`

Get secondary city for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: Secondary city or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_city2

city = ifsc_to_city2("SBIN0000001")
print(city)  # 'KOLKATA'
```

## `ifsc_to_state(ifsc_code: str) -> str | None`

Get state for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: State name or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_state

state = ifsc_to_state("SBIN0000001")
print(state)  # 'WEST BENGAL'
```

## `ifsc_to_std_code(ifsc_code: str) -> str | None`

Get STD code for an IFSC code.

### Parameters

- **`ifsc_code`** (str): 11-character IFSC code

### Returns

- **`str | None`**: STD code or `None` if not found

### Example

```python
from ifscfinder import ifsc_to_std_code

std_code = ifsc_to_std_code("HDFC0000001")
print(std_code)  # '91.0'
```

## Usage Pattern

Helper functions are convenient for extracting specific fields:

```python
from ifscfinder import (
    ifsc_to_bank,
    ifsc_to_branch,
    ifsc_to_state
)

ifsc = "ICIC0000001"

print(f"Bank: {ifsc_to_bank(ifsc)}")
print(f"Branch: {ifsc_to_branch(ifsc)}")
print(f"State: {ifsc_to_state(ifsc)}")
```

## Performance

Helper functions use the same caching mechanism as `lookup()`. Subsequent calls for the same IFSC code will use the cache.

## Error Handling

All helper functions return `None` if:
- IFSC code is invalid (wrong length, non-alphanumeric)
- IFSC code is not found
- Field value is null or empty

