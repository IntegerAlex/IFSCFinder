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
    db = get_database()
    if not db:
        return None
    result = db.lookup(normalized_ifsc)
    if not result:
        return None
    return {key: str(value) for key, value in result.items()}


def lookup(ifsc_code: str) -> Optional[Dict[str, str]]:
    normalized = normalize_ifsc_code(ifsc_code)
    if normalized is None:
        return None
    return _cached_lookup(normalized)


ifsc_to_details = lookup


def search(params: dict, exact: bool = True, limit: int = 100) -> list:
    db = get_database()
    if not db:
        return []
    conditions = []
    values = []
    for field, db_col in [("bank", "bank"), ("branch", "branch"), ("city", "city1"), ("state", "state")]:
        val = params.get(field)
        if val:
            if exact:
                conditions.append(f"{db_col} = ?")
                values.append(val.upper())
            else:
                conditions.append(f"{db_col} LIKE ?")
                values.append(f"%{val.upper()}%")
    if not conditions:
        return []
    query = f"SELECT * FROM ifsc_codes WHERE {' AND '.join(conditions)} LIMIT ?"
    values.append(limit)
    try:
        rows = db._conn.execute(query, values).fetchall()
        result = []
        for row in rows:
            d = {}
            for key in row.keys():
                val = row[key]
                if val is not None and str(val).strip():
                    d[key.upper()] = str(val).strip()
            result.append(d)
        return result
    except Exception:
        return []


def _field_from_details(ifsc_code: str, field: str) -> Optional[str]:
    details = lookup(ifsc_code)
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
    "lookup",
    "search",
]
