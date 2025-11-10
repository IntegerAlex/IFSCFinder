from __future__ import annotations

from functools import lru_cache
from typing import Dict, Optional

from .main import get_database, normalize_ifsc_code

IFSC_LOOKUP_FIELDS = (
    "BANK",
    "BRANCH",
    "ADDRESS",
    "CITY1",
    "CITY2",
    "STATE",
    "STD_CODE",
)


@lru_cache(maxsize=1024)
def _cached_lookup(normalized_ifsc: str) -> Optional[Dict[str, str]]:
    """
    Lookup details for a normalized IFSC code with caching.

    Args:
        normalized_ifsc: Upper-case, validated IFSC code.

    Returns:
        Dictionary of IFSC details or None if not found.
    """
    db = get_database()
    if not db:
        return None

    result = db.lookup(normalized_ifsc)
    if not result:
        return None

    return {key: str(value) for key, value in result.items()}


def ifsc_to_details(ifsc_code: str) -> Optional[Dict[str, str]]:
    """
    Retrieve bank metadata for an IFSC code.

    Args:
        ifsc_code: Raw IFSC code string.

    Returns:
        Dictionary of IFSC details or None.
    """
    normalized = normalize_ifsc_code(ifsc_code)
    if normalized is None:
        return None

    return _cached_lookup(normalized)


def _field_from_details(ifsc_code: str, field: str) -> Optional[str]:
    details = ifsc_to_details(ifsc_code)
    return details.get(field) if details else None


def ifsc_to_bank(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "BANK")


def ifsc_to_branch(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "BRANCH")


def ifsc_to_address(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "ADDRESS")


def ifsc_to_city1(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "CITY1")


def ifsc_to_city2(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "CITY2")


def ifsc_to_state(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "STATE")


def ifsc_to_std_code(ifsc_code: str) -> Optional[str]:
    return _field_from_details(ifsc_code, "STD_CODE")


def clear_lookup_cache() -> None:
    """Invalidate the in-memory IFSC lookup cache."""
    _cached_lookup.cache_clear()


__all__ = [
    "IFSC_LOOKUP_FIELDS",
    "clear_lookup_cache",
    "ifsc_to_address",
    "ifsc_to_bank",
    "ifsc_to_branch",
    "ifsc_to_city1",
    "ifsc_to_city2",
    "ifsc_to_details",
    "ifsc_to_state",
    "ifsc_to_std_code",
]

