from __future__ import annotations

from importlib import metadata

from .main import (
    APP_NAME,
    IFSCDatabase,
    get_database,
    load_ifsc_data,
    normalize_ifsc_code,
)
from .utils import (
    IFSC_LOOKUP_FIELDS,
    clear_lookup_cache,
    ifsc_to_address,
    ifsc_to_bank,
    ifsc_to_branch,
    ifsc_to_city1,
    ifsc_to_city2,
    ifsc_to_details,
    ifsc_to_state,
    ifsc_to_std_code,
)

try:
    __version__ = metadata.version("ifscfinder")
except metadata.PackageNotFoundError:  # pragma: no cover - during local development
    __version__ = "0.0.0"

__all__ = [
    "APP_NAME",
    "IFSC_LOOKUP_FIELDS",
    "IFSCDatabase",
    "clear_lookup_cache",
    "get_database",
    "ifsc_to_address",
    "ifsc_to_bank",
    "ifsc_to_branch",
    "ifsc_to_city1",
    "ifsc_to_city2",
    "ifsc_to_details",
    "ifsc_to_state",
    "ifsc_to_std_code",
    "load_ifsc_data",
    "normalize_ifsc_code",
    "__version__",
]

