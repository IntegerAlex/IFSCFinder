# Caching Strategy

IFSCFinder uses an LRU (Least Recently Used) cache to accelerate repeated lookups.

## Cache Architecture

### LRU Cache Implementation

All implementations use an LRU cache with the following characteristics:

- **Size**: Configurable (default: 1024 entries)
- **Eviction**: Least recently used entries evicted when full
- **Scope**: Per-process singleton
- **Performance**: 40x speedup for cached lookups

### Cache Structure

```
┌─────────────────────────────────────┐
│         LRU Cache (1024 entries)    │
├─────────────────────────────────────┤
│  IFSC Code → IfscDetails | null     │
│  ─────────────────────────────────  │
│  SBIN0000001 → {BANK: "SBI", ...}   │
│  HDFC0000001 → {BANK: "HDFC", ...}  │
│  ICIC0000001 → {BANK: "ICICI", ...} │
│  ...                                 │
└─────────────────────────────────────┘
```

## Cache Behavior

### Cache Hit

When a cached IFSC code is requested:

1. Check cache for normalized IFSC code
2. If found, return cached result immediately
3. No database query required
4. Performance: ~0.0004ms per lookup

### Cache Miss

When an uncached IFSC code is requested:

1. Check cache (miss)
2. Query database
3. Process result
4. Store in cache (including null for not found)
5. Return result
6. Performance: ~0.01ms per lookup

### Cache Eviction

When cache is full and new entry is added:

1. Identify least recently used entry
2. Remove from cache
3. Add new entry
4. Maintain cache size limit

## Cache Configuration

### Default Size

All implementations default to 1024 entries:

```python
# Python
cache = LRUCache(max_size=1024)
```

```typescript
// TypeScript
const cache = new LRUCache(1024);
```

### Custom Size

All implementations support custom cache size:

```python
from ifscfinder import get_cache

cache = get_cache(size=2048)  # 2048 entry cache
```

```typescript
import { getCache } from 'ifscfinder-ts';

const cache = getCache(2048); // 2048 entry cache
```

## Cache Invalidation

### Manual Clear

All implementations provide `clearCache()` function:

```python
from ifscfinder import clear_cache

clear_cache()  # Clear all cached entries
```

```typescript
import { clearCache } from 'ifscfinder-ts';

clearCache(); // Clear all cached entries
```

### When to Clear

Clear cache when:
- Database is updated
- Memory needs to be freed
- Testing with fresh data
- Debugging cache-related issues

## Cache Performance

### Speedup

Cached lookups are **40x faster** than uncached:

- **Uncached**: 0.01ms per lookup
- **Cached**: 0.0004ms per lookup
- **Speedup**: 40x

### Throughput

- **Uncached**: 136,845 lookups/second
- **Cached**: 5,526,092 lookups/second
- **Improvement**: 40x throughput increase

## Cache Memory Usage

### Per Entry

Each cache entry stores:
- **Key**: Normalized IFSC code (11 bytes)
- **Value**: IfscDetails object (~200-500 bytes)
- **Overhead**: LRU tracking (~16 bytes)

**Total per entry**: ~250-550 bytes

### Total Memory

For 1024 entry cache:
- **Minimum**: ~256 KB
- **Maximum**: ~563 KB
- **Average**: ~400 KB

## Cache Implementation Details

### Python Implementation

```python
class LRUCache:
    def __init__(self, max_size: int = 1024):
        self.cache = OrderedDict()
        self.max_size = max_size
    
    def get(self, key: str):
        if key in self.cache:
            # Move to end (most recently used)
            self.cache.move_to_end(key)
            return self.cache[key]
        return None
    
    def set(self, key: str, value: Any):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.max_size:
            # Remove least recently used
            self.cache.popitem(last=False)
```

### TypeScript Implementation

```typescript
class LRUCache {
  private cache: Map<string, IfscDetails | null>;
  private maxSize: number;

  get(key: string): IfscDetails | null | undefined {
    if (!this.cache.has(key)) return undefined;
    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: string, value: IfscDetails | null): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.maxSize) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}
```

## Cache Best Practices

### Size Selection

Choose cache size based on:
- **Memory constraints**: Larger cache = more memory
- **Access patterns**: More repeated queries = larger cache
- **Database size**: Cache should be smaller than database

### Typical Sizes

- **Small applications**: 512 entries (~200 KB)
- **Medium applications**: 1024 entries (~400 KB) - **Default**
- **Large applications**: 2048 entries (~800 KB)
- **High-throughput**: 4096 entries (~1.6 MB)

### Monitoring

Monitor cache performance:
- **Hit rate**: Percentage of cache hits
- **Memory usage**: Cache memory footprint
- **Eviction rate**: How often entries are evicted

## Cache Limitations

### Memory Bound

Cache size is limited by available memory. Very large caches may:
- Consume significant memory
- Impact garbage collection
- Reduce overall performance

### Not Persistent

Cache is in-memory only:
- Lost on process restart
- Not shared across processes
- Not persisted to disk

### Single Process

Cache is per-process:
- Not shared across processes
- Each process has its own cache
- No cross-process cache synchronization

## Future Enhancements

### Distributed Cache

Future versions may support:
- Redis integration
- Shared cache across processes
- Persistent cache storage

### Adaptive Sizing

Future versions may support:
- Automatic cache size adjustment
- Memory-aware eviction
- Performance-based optimization

