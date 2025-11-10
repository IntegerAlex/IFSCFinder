# Data Format

This document describes the data format used by IFSCFinder.

## IFSC Code Format

### Structure

IFSC codes are 11 characters long:

```
AAAAA000000
│     │
│     └─ Branch Code (6 digits)
└─────── Bank Code (4 characters)
```

### Examples

- `SBIN0000001` - State Bank of India
- `HDFC0000001` - HDFC Bank
- `ICIC0000001` - ICICI Bank

### Validation Rules

1. **Length**: Exactly 11 characters
2. **Format**: Alphanumeric (A-Z, 0-9)
3. **Case**: Case-insensitive (normalized to uppercase)
4. **Whitespace**: Trimmed before validation

## Return Data Format

### IfscDetails Structure

```typescript
type IfscDetails = {
  CODE: string;        // IFSC code (e.g., "SBIN0000001")
  BANK: string;        // Bank name (e.g., "STATE BANK OF INDIA")
  BRANCH: string;      // Branch name (e.g., "KOLKATA MAIN")
  ADDRESS: string;     // Full address
  CITY1: string;       // Primary city (e.g., "KOLKATA")
  CITY2: string;       // Secondary city (may be same as CITY1)
  STATE: string;       // State name (e.g., "WEST BENGAL")
  STD_CODE?: string;   // STD code (optional, e.g., "91.0")
}
```

### Field Descriptions

- **`CODE`**: 11-character IFSC code (always present)
- **`BANK`**: Bank name (always present)
- **`BRANCH`**: Branch name (always present)
- **`ADDRESS`**: Full branch address (may be present)
- **`CITY1`**: Primary city name (always present)
- **`CITY2`**: Secondary city name (may be same as CITY1)
- **`STATE`**: State name (always present)
- **`STD_CODE`**: STD code (optional, may be null)

### Null Handling

Fields with null or empty values are **omitted** from the result:

```python
# Python
details = lookup("SBIN0000001")
# If STD_CODE is null, it won't be in the result
assert "STD_CODE" not in details  # May be omitted
```

```typescript
// TypeScript
const details = lookup('SBIN0000001');
// If STD_CODE is null, it won't be in the result
assert(details.STD_CODE === undefined); // May be omitted
```

## Search Parameters

### SearchParams Structure

```typescript
type SearchParams = {
  bank?: string;    // Bank name (optional)
  branch?: string; // Branch name (optional)
  city?: string;   // City name (optional)
  state?: string;  // State name (optional)
}
```

### SearchOptions Structure

```typescript
type SearchOptions = {
  limit?: number;  // Maximum results (default: 100)
  exact?: boolean; // Exact match vs LIKE search (default: true)
}
```

## Database Format

### SQLite Schema

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

### Data Types

- **`code`**: TEXT (11 characters, PRIMARY KEY)
- **`bank`**: TEXT (variable length)
- **`branch`**: TEXT (variable length)
- **`address`**: TEXT (variable length)
- **`city1`**: TEXT (variable length)
- **`city2`**: TEXT (variable length)
- **`state`**: TEXT (variable length)
- **`std_code`**: TEXT (variable length, nullable)

## Export Formats

### JSON Format

```json
{
  "CODE": "SBIN0000001",
  "BANK": "STATE BANK OF INDIA",
  "BRANCH": "KOLKATA MAIN",
  "ADDRESS": "SAMRIDDHI BHAWAN, 1 STRAND ROAD, KOLKATA 700 001",
  "CITY1": "KOLKATA",
  "CITY2": "KOLKATA",
  "STATE": "WEST BENGAL"
}
```

### CSV Format

```csv
CODE,BANK,BRANCH,ADDRESS,CITY1,CITY2,STATE,STD_CODE
SBIN0000001,STATE BANK OF INDIA,KOLKATA MAIN,"SAMRIDDHI BHAWAN, 1 STRAND ROAD, KOLKATA 700 001",KOLKATA,KOLKATA,WEST BENGAL,
```

## Data Encoding

### Character Encoding

- **Encoding**: UTF-8
- **Normalization**: NFC (Canonical Composition)
- **Case**: Uppercase for IFSC codes

### Special Characters

- **Addresses**: May contain commas, periods, and other punctuation
- **City Names**: May contain hyphens and spaces
- **State Names**: May contain spaces

## Data Validation

### Input Validation

All inputs are validated before processing:

1. **IFSC Code**: Length, format, alphanumeric check
2. **Search Params**: Type checking, null handling
3. **Options**: Range checking, default values

### Output Validation

All outputs are validated before returning:

1. **Field Names**: Uppercase, consistent
2. **Field Values**: Non-null, non-empty
3. **Structure**: Consistent across languages

## Data Size

### Database Size

- **Total Size**: ~42MB
- **Record Count**: ~150,000+ IFSC codes
- **Compression**: SQLite native compression

### Memory Usage

- **Database**: 42MB (embedded SQLite)
- **Cache**: ~1MB (1024 entries)
- **Runtime**: Minimal overhead

## Data Updates

### Update Frequency

- **Initial Load**: Complete database snapshot
- **Updates**: Incremental updates as new branches are added
- **Validation**: Data validated before inclusion

### Update Process

1. **Fetch Data**: Download latest IFSC data
2. **Validate Data**: Validate format and integrity
3. **Convert Format**: Convert to SQLite format
4. **Build Database**: Create optimized database
5. **Test Database**: Verify database integrity
6. **Release**: Package and release new version

