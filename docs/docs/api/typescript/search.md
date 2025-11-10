# TypeScript API - Search

## `search(params: SearchParams, options?: SearchOptions): IfscDetails[]`

Search for IFSC codes by bank, branch, city, or state.

### Parameters

- **`params`** (SearchParams): Search criteria
  - `bank?` (string): Bank name
  - `branch?` (string): Branch name
  - `city?` (string): City name
  - `state?` (string): State name

- **`options`** (SearchOptions, optional): Search options
  - `limit?` (number): Maximum results (default: 100)
  - `exact?` (boolean): Exact match vs LIKE search (default: true)

### Returns

- **`IfscDetails[]`**: Array of matching IFSC details

### Type Definitions

```typescript
type SearchParams = {
  bank?: string;
  branch?: string;
  city?: string;
  state?: string;
};

type SearchOptions = {
  limit?: number;
  exact?: boolean;
};
```

### Examples

#### Search by Bank

```typescript
import { search } from 'ifscfinder-ts';

// Exact match
const results = search({ bank: 'STATE BANK OF INDIA' }, { limit: 10 });

results.forEach(result => {
  console.log(result.CODE, result.BRANCH);
});
```

#### Search by State

```typescript
import { search } from 'ifscfinder-ts';

// Find all branches in Maharashtra
const results = search({ state: 'MAHARASHTRA' }, { limit: 50 });

console.log(`Found ${results.length} branches`);
```

#### Partial Match

```typescript
import { search } from 'ifscfinder-ts';

// Partial match (LIKE search)
const results = search(
  { bank: 'HDFC' },
  { exact: false, limit: 20 }
);

results.forEach(result => {
  console.log(result.BANK, result.BRANCH);
});
```

#### Combined Search

```typescript
import { search } from 'ifscfinder-ts';

// Search by bank and state
const results = search(
  { bank: 'HDFC BANK', state: 'MAHARASHTRA' },
  { limit: 10 }
);

results.forEach(result => {
  console.log(`${result.CODE}: ${result.BRANCH}, ${result.CITY1}`);
});
```

#### Search by City

```typescript
import { search } from 'ifscfinder-ts';

// Find all branches in Mumbai
const results = search({ city: 'MUMBAI' }, { limit: 100 });

results.forEach(result => {
  console.log(`${result.CODE}: ${result.BANK} - ${result.BRANCH}`);
});
```

### Search Options

#### Limit

Control the maximum number of results:

```typescript
// Get top 10 results
const results = search({ bank: 'ICICI BANK' }, { limit: 10 });
```

#### Exact vs Partial Match

```typescript
// Exact match (default)
const exactResults = search({ bank: 'HDFC BANK' }, { exact: true });

// Partial match (LIKE search)
const partialResults = search({ bank: 'HDFC' }, { exact: false });
```

### Performance

Search performance depends on:

- **Number of filters**: More filters = faster (smaller result set)
- **Index usage**: Searches on indexed columns are faster
- **Result limit**: Smaller limits = faster queries

### Notes

- Empty search params return empty array
- All searches are case-insensitive
- City search checks both CITY1 and CITY2 fields
- Results are ordered by relevance (exact matches first)

