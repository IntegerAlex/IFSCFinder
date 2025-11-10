# Error Handling

IFSCFinder uses consistent error handling patterns across all implementations.

## Error Handling Principles

### 1. Graceful Degradation

All implementations return `null` (or equivalent) for errors instead of throwing exceptions:

```python
# Python
details = lookup("INVALID123")
assert details is None  # Returns None, doesn't throw
```

```typescript
// TypeScript
const details = lookup('INVALID123');
assert(details === null); // Returns null, doesn't throw
```

### 2. Consistent Behavior

All implementations handle errors the same way:

- **Invalid input**: Returns `null`
- **Not found**: Returns `null`
- **Database errors**: Returns `null`

### 3. No Exceptions

Public APIs never throw exceptions:

```python
# Good: Returns None
details = lookup("INVALID123")
if details is None:
    print("Not found")

# Bad: Throws exception (not used)
try:
    details = lookup("INVALID123")
except Exception:
    print("Error")
```

## Error Scenarios

### Invalid IFSC Code

**Scenario**: IFSC code is invalid (wrong length, non-alphanumeric)

**Behavior**: Returns `null`

```python
# Python
details = lookup("INVALID123")  # Wrong length
assert details is None

details = lookup("SBIN@00001")  # Non-alphanumeric
assert details is None
```

```typescript
// TypeScript
const details = lookup('INVALID123'); // Wrong length
assert(details === null);

const details2 = lookup('SBIN@00001'); // Non-alphanumeric
assert(details2 === null);
```

### IFSC Code Not Found

**Scenario**: IFSC code is valid but not found in database

**Behavior**: Returns `null`

```python
# Python
details = lookup("XXXX9999999")  # Valid format, not found
assert details is None
```

```typescript
// TypeScript
const details = lookup('XXXX9999999'); // Valid format, not found
assert(details === null);
```

### Database Errors

**Scenario**: Database connection error, query error, etc.

**Behavior**: Returns `null` (graceful degradation)

```python
# Python
# If database is unavailable, returns None
details = lookup("SBIN0000001")
# May return None if database error occurs
```

```typescript
// TypeScript
// If database is unavailable, returns null
const details = lookup('SBIN0000001');
// May return null if database error occurs
```

## Error Handling Patterns

### Lookup Functions

All lookup functions return `null` for errors:

```python
# Python
def lookup(ifsc_code: str) -> dict | None:
    try:
        # Database query
        result = db.lookup(ifsc_code)
        return result
    except Exception:
        # Graceful degradation
        return None
```

```typescript
// TypeScript
function lookup(ifscCode: string): IfscDetails | null {
  try {
    // Database query
    const result = db.lookup(ifscCode);
    return result;
  } catch (error) {
    // Graceful degradation
    return null;
  }
}
```

### Helper Functions

All helper functions return `null` for errors:

```python
# Python
def ifsc_to_bank(ifsc_code: str) -> str | None:
    details = lookup(ifsc_code)
    if details is None:
        return None
    return details.get("BANK")
```

```typescript
// TypeScript
function ifscToBank(ifscCode: string): string | null {
  const details = lookup(ifscCode);
  if (!details) {
    return null;
  }
  return details.BANK ?? null;
}
```

### Search Functions

Search functions return empty array for errors:

```python
# Python
def search(params: dict, options: dict = None) -> list:
    try:
        # Database query
        results = db.search(params, options)
        return results
    except Exception:
        # Graceful degradation
        return []
```

```typescript
// TypeScript
function search(
  params: SearchParams,
  options?: SearchOptions
): IfscDetails[] {
  try {
    // Database query
    const results = db.search(params, options);
    return results;
  } catch (error) {
    // Graceful degradation
    return [];
  }
}
```

## Error Handling Best Practices

### 1. Check for Null

Always check for null before using results:

```python
# Python
details = lookup("SBIN0000001")
if details:
    print(details["BANK"])
else:
    print("Not found")
```

```typescript
// TypeScript
const details = lookup('SBIN0000001');
if (details) {
  console.log(details.BANK);
} else {
  console.log('Not found');
}
```

### 2. Use Helper Functions

Helper functions handle null checks:

```python
# Python
bank = ifsc_to_bank("SBIN0000001")
if bank:
    print(bank)
```

```typescript
// TypeScript
const bank = ifscToBank('SBIN0000001');
if (bank) {
  console.log(bank);
}
```

### 3. Validate Input

Validate input before calling functions:

```python
# Python
def is_valid_ifsc(ifsc_code: str) -> bool:
    if not ifsc_code or len(ifsc_code) != 11:
        return False
    return ifsc_code.isalnum()

if is_valid_ifsc(ifsc_code):
    details = lookup(ifsc_code)
```

```typescript
// TypeScript
function isValidIfsc(ifscCode: string): boolean {
  if (!ifscCode || ifscCode.length !== 11) {
    return false;
  }
  return /^[A-Z0-9]+$/.test(ifscCode);
}

if (isValidIfsc(ifscCode)) {
  const details = lookup(ifscCode);
}
```

## Internal Error Handling

### Database Errors

Database errors are handled internally:

```python
# Python
def lookup(ifsc_code: str) -> dict | None:
    try:
        # Database query
        result = db.lookup(ifsc_code)
        return result
    except sqlite3.Error:
        # Log error internally (optional)
        return None
    except Exception:
        # Catch-all for other errors
        return None
```

### Cache Errors

Cache errors are handled internally:

```python
# Python
def lookup(ifsc_code: str) -> dict | None:
    # Check cache
    cached = cache.get(ifsc_code)
    if cached is not None:
        return cached
    
    # Database query
    result = db.lookup(ifsc_code)
    
    # Update cache (may fail silently)
    try:
        cache.set(ifsc_code, result)
    except Exception:
        # Cache error doesn't affect result
        pass
    
    return result
```

## Error Logging

### Internal Logging

Errors may be logged internally (optional):

```python
# Python
import logging

logger = logging.getLogger(__name__)

def lookup(ifsc_code: str) -> dict | None:
    try:
        result = db.lookup(ifsc_code)
        return result
    except Exception as e:
        # Log error internally
        logger.error(f"Lookup error: {e}")
        return None
```

### User-Facing Errors

User-facing errors are never thrown:

```python
# Python
# Good: Returns None
details = lookup("INVALID123")
if details is None:
    print("IFSC code not found")

# Bad: Throws exception (not used)
try:
    details = lookup("INVALID123")
except Exception as e:
    print(f"Error: {e}")
```

## Error Handling Summary

| Error Type | Behavior | Return Value |
|------------|----------|--------------|
| Invalid IFSC | Returns `null` | `null` |
| Not Found | Returns `null` | `null` |
| Database Error | Returns `null` | `null` |
| Cache Error | Returns `null` | `null` |
| Search Error | Returns `[]` | Empty array |

## Best Practices

1. **Always Check for Null**: Check return values before using
2. **Use Helper Functions**: Helper functions handle null checks
3. **Validate Input**: Validate input before calling functions
4. **Graceful Degradation**: Handle errors gracefully
5. **No Exceptions**: Public APIs never throw exceptions

