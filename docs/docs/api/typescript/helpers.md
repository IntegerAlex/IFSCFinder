# TypeScript API - Helper Functions

Convenience functions for extracting specific fields from IFSC codes.

## `ifscToBank(ifscCode: string): string | null`

Get bank name for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: Bank name or `null` if not found

### Example

```typescript
import { ifscToBank } from 'ifscfinder-ts';

const bank = ifscToBank('SBIN0000001');
console.log(bank); // 'STATE BANK OF INDIA'
```

## `ifscToBranch(ifscCode: string): string | null`

Get branch name for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: Branch name or `null` if not found

### Example

```typescript
import { ifscToBranch } from 'ifscfinder-ts';

const branch = ifscToBranch('SBIN0000001');
console.log(branch); // 'KOLKATA MAIN'
```

## `ifscToAddress(ifscCode: string): string | null`

Get address for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: Address or `null` if not found

### Example

```typescript
import { ifscToAddress } from 'ifscfinder-ts';

const address = ifscToAddress('SBIN0000001');
console.log(address); // 'SAMRIDDHI BHAWAN, 1 STRAND ROAD, KOLKATA 700 001'
```

## `ifscToCity1(ifscCode: string): string | null`

Get primary city for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: Primary city or `null` if not found

### Example

```typescript
import { ifscToCity1 } from 'ifscfinder-ts';

const city = ifscToCity1('SBIN0000001');
console.log(city); // 'KOLKATA'
```

## `ifscToCity2(ifscCode: string): string | null`

Get secondary city for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: Secondary city or `null` if not found

### Example

```typescript
import { ifscToCity2 } from 'ifscfinder-ts';

const city = ifscToCity2('SBIN0000001');
console.log(city); // 'KOLKATA'
```

## `ifscToState(ifscCode: string): string | null`

Get state for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: State name or `null` if not found

### Example

```typescript
import { ifscToState } from 'ifscfinder-ts';

const state = ifscToState('SBIN0000001');
console.log(state); // 'WEST BENGAL'
```

## `ifscToStdCode(ifscCode: string): string | null`

Get STD code for an IFSC code.

### Parameters

- **`ifscCode`** (string): 11-character IFSC code

### Returns

- **`string | null`**: STD code or `null` if not found

### Example

```typescript
import { ifscToStdCode } from 'ifscfinder-ts';

const stdCode = ifscToStdCode('HDFC0000001');
console.log(stdCode); // '91.0'
```

## Usage Pattern

Helper functions are convenient for extracting specific fields:

```typescript
import {
  ifscToBank,
  ifscToBranch,
  ifscToState
} from 'ifscfinder-ts';

const ifsc = 'ICIC0000001';

console.log(`Bank: ${ifscToBank(ifsc)}`);
console.log(`Branch: ${ifscToBranch(ifsc)}`);
console.log(`State: ${ifscToState(ifsc)}`);
```

## Performance

Helper functions use the same caching mechanism as `lookup()`. Subsequent calls for the same IFSC code will use the cache.

## Error Handling

All helper functions return `null` if:
- IFSC code is invalid (wrong length, non-alphanumeric)
- IFSC code is not found
- Field value is null or empty

