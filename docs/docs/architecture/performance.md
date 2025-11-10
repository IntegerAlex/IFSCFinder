# Performance

IFSCFinder is designed for high-performance IFSC lookups with sub-millisecond query times.

## Performance Metrics

### Lookup Performance

| Implementation | Uncached | Cached | Cache Speedup |
|---------------|----------|--------|---------------|
| **Python** | 0.01ms | 0.00ms | 40.4x |
| **TypeScript** | 0.015ms | 0.0004ms | 37.5x |
| **Go** | TBD | TBD | TBD |
| **Rust** | TBD | TBD | TBD |

### Throughput

| Implementation | Uncached (ops/sec) | Cached (ops/sec) |
|---------------|-------------------|------------------|
| **Python** | 136,845 | 5,526,092 |
| **TypeScript** | 66,000 | 2,500,000 |
| **Go** | TBD | TBD |
| **Rust** | TBD | TBD |

## Performance Characteristics

### Uncached Lookups

Uncached lookups involve:
1. Input validation (~0.001ms)
2. Cache check (~0.001ms)
3. Database query (~0.008ms)
4. Result processing (~0.001ms)
5. Cache update (~0.001ms)

**Total**: ~0.01ms per lookup

### Cached Lookups

Cached lookups involve:
1. Input validation (~0.001ms)
2. Cache lookup (~0.0003ms)
3. Return result (~0.0001ms)

**Total**: ~0.0004ms per lookup

## Performance Optimization

### Database Optimization

1. **WAL Mode**: Enables concurrent reads
2. **Prepared Statements**: Reused query plans
3. **Indexes**: Fast lookups on indexed columns
4. **Cache Size**: 1MB cache for hot data

### Caching Optimization

1. **LRU Cache**: Efficient eviction strategy
2. **Normalized Keys**: Consistent cache keys
3. **Null Caching**: Cache not-found results
4. **Singleton Pattern**: Single cache instance

### Query Optimization

1. **Primary Key Lookup**: O(1) lookup time
2. **Index Usage**: Fast searches on indexed columns
3. **Result Limiting**: Smaller result sets
4. **Prepared Statements**: Query plan caching

## Benchmark Results

### Python Benchmarks

```
Uncached Lookup: 0.01ms per query
Cached Lookup: 0.00ms per query
Cache Speedup: 40.4x faster
Throughput (uncached): 136,845 ops/sec
Throughput (cached): 5,526,092 ops/sec
```

### TypeScript Benchmarks

```
Uncached Lookup: 0.015ms per query
Cached Lookup: 0.0004ms per query
Cache Speedup: 37.5x faster
Throughput (uncached): 66,000 ops/sec
Throughput (cached): 2,500,000 ops/sec
```

## Performance Comparison

### vs External APIs

| Method | Latency | Throughput | Offline |
|--------|---------|------------|---------|
| **IFSCFinder** | 0.01ms | 136K ops/sec | ✅ Yes |
| **External API** | 50-200ms | 10-50 ops/sec | ❌ No |

**Advantages:**
- 5000-20000x faster
- 2700-13600x higher throughput
- Works offline
- No network latency

### vs In-Memory Maps

| Method | Memory | Latency | Update |
|--------|--------|---------|--------|
| **IFSCFinder** | 42MB | 0.01ms | Easy |
| **In-Memory Map** | 200MB+ | 0.001ms | Hard |

**Trade-offs:**
- IFSCFinder: Lower memory, easy updates
- In-Memory Map: Faster, higher memory

## Performance Tips

### Use Caching

Enable caching for repeated queries:

```python
from ifscfinder import lookup

# First lookup - database query
details1 = lookup("SBIN0000001")

# Second lookup - cached result
details2 = lookup("SBIN0000001")  # 40x faster
```

### Batch Processing

Process multiple IFSC codes in batches:

```python
from ifscfinder import lookup

ifsc_codes = ["SBIN0000001", "HDFC0000001", "ICIC0000001"]

# First pass - populate cache
for ifsc in ifsc_codes:
    lookup(ifsc)

# Second pass - use cached results
for ifsc in ifsc_codes:
    details = lookup(ifsc)  # Fast cached lookup
```

### Optimize Search Queries

Use specific search parameters:

```python
from ifscfinder import search

# More specific = faster
results = search(
    {"bank": "HDFC BANK", "state": "MAHARASHTRA", "city": "MUMBAI"},
    limit=10
)
```

## Performance Monitoring

### Metrics to Track

- **Lookup latency**: Average lookup time
- **Cache hit rate**: Percentage of cache hits
- **Throughput**: Lookups per second
- **Memory usage**: Cache and database memory

### Profiling

Profile your application to identify bottlenecks:

```python
import cProfile
from ifscfinder import lookup

profiler = cProfile.Profile()
profiler.enable()

for _ in range(1000):
    lookup("SBIN0000001")

profiler.disable()
profiler.print_stats()
```

## Performance Targets

All implementations target:

- **Uncached lookup**: < 0.1ms per query
- **Cached lookup**: < 0.001ms per query
- **Throughput**: 100K+ lookups/second (uncached)
- **Memory**: < 50MB total footprint

## Performance Regression

### Testing

All implementations include performance tests:

```python
# Python
python -m pytest tests/performance.py

# TypeScript
npm run bench
```

### Monitoring

Monitor performance in CI/CD:

- Automated benchmarks on each commit
- Performance regression detection
- Alert on significant performance degradation

## Future Optimizations

### Potential Improvements

1. **Memory-Mapped Database**: Faster database access
2. **Compiled Queries**: Pre-compiled query plans
3. **SIMD Operations**: Vectorized processing
4. **Parallel Processing**: Multi-threaded lookups

### Research Areas

1. **Alternative Storage**: LMDB, RocksDB
2. **Compression**: Better compression algorithms
3. **Indexing**: Advanced indexing strategies
4. **Caching**: Distributed caching solutions

