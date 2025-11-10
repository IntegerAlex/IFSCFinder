#!/usr/bin/env python3
"""
Advanced IFSC lookup examples demonstrating various use cases.
"""

import sys
from .. import (
    ifsc_to_details, ifsc_to_bank, ifsc_to_branch,
    ifsc_to_address, ifsc_to_city1, ifsc_to_state,
    ifsc_to_std_code, clear_lookup_cache
)


def run_lookup_examples():
    """Run comprehensive lookup examples."""
    print("IFSCFinder - Advanced Lookup Examples")
    print("=" * 50)

    # Test with various IFSC codes
    examples = [
        {
            "code": "SBIN0000001",
            "description": "State Bank of India, Mumbai"
        },
        {
            "code": "HDFC0000001",
            "description": "HDFC Bank, Delhi"
        },
        {
            "code": "ICIC0000001",
            "description": "ICICI Bank, Vadodara"
        }
    ]

    for example in examples:
        ifsc = example["code"]
        desc = example["description"]

        print(f"\n{desc} ({ifsc})")
        print("-" * 40)

        # Full details lookup
        details = ifsc_to_details(ifsc)
        if details:
            print("Full Details:")
            for key, value in details.items():
                print(f"  {key}: {value}")

            print("\nField-specific lookups:")
            print(f"  Bank: {ifsc_to_bank(ifsc)}")
            print(f"  Branch: {ifsc_to_branch(ifsc)}")
            print(f"  Address: {ifsc_to_address(ifsc)}")
            print(f"  City: {ifsc_to_city1(ifsc)}")
            print(f"  State: {ifsc_to_state(ifsc)}")
            print(f"  STD Code: {ifsc_to_std_code(ifsc)}")
        else:
            print("❌ IFSC code not found!")

    # Demonstrate cache clearing
    print("\n" + "=" * 50)
    print("Cache Management Demo")
    print("-" * 20)

    # Lookup again to show caching
    print("Looking up SBIN0000001 again (should use cache)...")
    bank = ifsc_to_bank("SBIN0000001")
    print(f"Cached result: {bank}")

    # Clear cache and lookup again
    print("Clearing lookup cache...")
    clear_lookup_cache()
    print("Cache cleared!")

    print("\nAll examples completed!")


if __name__ == "__main__":
    run_lookup_examples()
