#!/usr/bin/env python3
"""
Basic IFSCFinder usage examples.
"""

import sys
from .. import ifsc_to_details, ifsc_to_bank, ifsc_to_branch, APP_NAME


def main():
    """Demonstrate basic IFSC lookup functionality."""
    print(f"Welcome to {APP_NAME}!")
    print("=" * 50)

    # Example IFSC codes
    test_codes = [
        "SBIN0000001",  # State Bank of India
        "HDFC0000001",  # HDFC Bank
        "ICIC0000001",  # ICICI Bank
    ]

    for ifsc in test_codes:
        print(f"\nLooking up IFSC: {ifsc}")
        print("-" * 30)

        details = ifsc_to_details(ifsc)
        if details:
            print(f"Bank: {details.get('BANK', 'N/A')}")
            print(f"Branch: {details.get('BRANCH', 'N/A')}")
            print(f"Address: {details.get('ADDRESS', 'N/A')}")
            print(f"City: {details.get('CITY1', 'N/A')}")
            print(f"State: {details.get('STATE', 'N/A')}")

            # Also demonstrate field-specific helpers
            bank = ifsc_to_bank(ifsc)
            branch = ifsc_to_branch(ifsc)
            print(f"Bank (via helper): {bank}")
            print(f"Branch (via helper): {branch}")
        else:
            print("IFSC code not found or invalid!")

    print("\n" + "=" * 50)
    print("Demo completed!")


if __name__ == "__main__":
    main()
