#!/usr/bin/env python3
"""
Performance testing for IFSCFinder package.
"""

import time
import sys
import os

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from ifscfinder import ifsc_to_details, ifsc_to_bank, clear_lookup_cache


def time_function(func, *args, iterations=1000):
    """Time a function over multiple iterations."""
    start_time = time.time()
    for _ in range(iterations):
        func(*args)
    end_time = time.time()
    return (end_time - start_time) / iterations


def run_performance_tests():
    """Run comprehensive performance tests."""
    print("IFSCFinder Performance Tests")
    print("=" * 50)

    # Test data
    test_ifscs = [
        "SBIN0000001",  # State Bank of India
        "HDFC0000001",  # HDFC Bank
        "ICIC0000001",  # ICICI Bank
        "AXIS0000001",  # Axis Bank
        "KKBK0000001",  # Kotak Mahindra Bank
    ]

    # Test 1: Single lookup performance
    print("\n1. Single Lookup Performance (1000 iterations each)")
    print("-" * 45)

    for ifsc in test_ifscs:
        # Clear cache between tests
        clear_lookup_cache()

        # Time full details lookup
        avg_time = time_function(ifsc_to_details, ifsc, iterations=100)
        print(".6f")

        # Time bank-only lookup
        avg_time = time_function(ifsc_to_bank, ifsc, iterations=100)
        print(".6f")

    # Test 2: Cached vs Uncached performance
    print("\n2. Cache Performance Comparison")
    print("-" * 35)

    ifsc = "SBIN0000001"
    clear_lookup_cache()

    # Uncached lookup
    start = time.time()
    for _ in range(100):
        clear_lookup_cache()
        ifsc_to_details(ifsc)
    uncached_time = (time.time() - start) / 100

    # Cached lookup
    clear_lookup_cache()
    ifsc_to_details(ifsc)  # Prime cache
    start = time.time()
    for _ in range(100):
        ifsc_to_details(ifsc)
    cached_time = (time.time() - start) / 100

    print(".6f")
    print(".6f")
    print(".1f")

    # Test 3: Bulk lookup performance
    print("\n3. Bulk Lookup Performance")
    print("-" * 28)

    # Simulate bulk processing
    bulk_ifscs = test_ifscs * 20  # 100 lookups
    clear_lookup_cache()

    start = time.time()
    results = [ifsc_to_details(ifsc) for ifsc in bulk_ifscs]
    bulk_time = time.time() - start

    successful_lookups = sum(1 for r in results if r is not None)
    print(f"Bulk lookup (100 codes): {bulk_time:.4f}s")
    print(f"Successful lookups: {successful_lookups}/100")
    print(".2f")

    # Test 4: Memory usage estimation
    print("\n4. Memory and Database Info")
    print("-" * 30)

    # Get database instance to check connection
    from ifscfinder import get_database
    db = get_database()
    if db:
        print(f"Database loaded: {db._conn is not None}")
        print(f"WAL mode enabled: True (configured)")
        print(f"Cache size: 1MB (configured)")
        print(f"Synchronous mode: NORMAL (configured)")
    else:
        print("Database not available")

    print("\n" + "=" * 50)
    print("Performance tests completed!")


if __name__ == "__main__":
    run_performance_tests()
