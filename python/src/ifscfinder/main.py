from __future__ import annotations

import logging
import sqlite3
from pathlib import Path
from threading import Lock
from typing import Any, Mapping, Optional

APP_NAME = "IFSCFinder"

_DEFAULT_DB_RELATIVE_PATH = ("data", "ifsc.db")
_DB_SINGLETON_LOCK = Lock()


def _resolve_database_path(db_path: Optional[str | Path]) -> Path:
    """
    Resolve the path to the SQLite database file.

    Args:
        db_path: Optional path supplied by the caller.

    Returns:
        Absolute path to the SQLite database file.

    Raises:
        FileNotFoundError: If the resolved database file does not exist.
    """
    if db_path is not None:
        candidate = Path(db_path).expanduser().resolve()
    else:
        candidate = Path(__file__).resolve().parent.joinpath(*_DEFAULT_DB_RELATIVE_PATH)

    if not candidate.exists():
        raise FileNotFoundError(
            f"{APP_NAME} database not found at {candidate}. "
            "Ensure the packaged `ifsc.db` is present or provide an explicit `db_path`."
        )

    return candidate


def normalize_ifsc_code(ifsc_code: Optional[str]) -> Optional[str]:
    """
    Validate and normalize an IFSC code.

    Args:
        ifsc_code: Raw IFSC code string.

    Returns:
        Upper-cased IFSC code when valid, otherwise None.
    """
    if ifsc_code is None:
        return None

    trimmed = ifsc_code.strip().upper()
    if len(trimmed) != 11 or not trimmed.isalnum():
        return None

    return trimmed


class IFSCDatabase:
    """
    Lightweight SQLite-backed repository for IFSC lookups.
    """

    def __init__(self, db_path: Optional[str | Path] = None) -> None:
        resolved_path = _resolve_database_path(db_path)

        self._db_path = resolved_path
        self._conn = sqlite3.connect(str(resolved_path), check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._query_lock = Lock()
        self._configure_connection()

    @property
    def db_path(self) -> Path:
        """Return the absolute database path."""
        return self._db_path

    def _configure_connection(self) -> None:
        """Apply SQLite pragmas optimised for read-heavy workloads."""
        try:
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._conn.execute("PRAGMA synchronous=NORMAL")
            self._conn.execute("PRAGMA cache_size=1000")
        except sqlite3.DatabaseError as exc:
            logging.getLogger(APP_NAME).warning("Failed to apply SQLite pragmas: %s", exc)

    def lookup(self, ifsc_code: Optional[str]) -> Optional[Mapping[str, Any]]:
        """
        Perform an IFSC lookup.

        Args:
            ifsc_code: Raw IFSC code (case-insensitive).

        Returns:
            Mapping of column names to values when found, otherwise None.
        """
        normalized_code = normalize_ifsc_code(ifsc_code)
        if normalized_code is None:
            return None

        query = "SELECT * FROM ifsc_codes WHERE code = ?"

        try:
            with self._query_lock:
                cursor = self._conn.execute(query, (normalized_code,))
                row = cursor.fetchone()
        except sqlite3.DatabaseError as exc:
            logging.getLogger(APP_NAME).error("Database error during lookup: %s", exc)
            return None

        if row is None:
            return None

        result = {}
        for key in row.keys():
            value = row[key]
            if value is not None:
                text_value = str(value).strip()
                if text_value:
                    result[key.upper()] = text_value

        return result

    def close(self) -> None:
        """Close the underlying SQLite connection."""
        if getattr(self, "_conn", None) is not None:
            self._conn.close()

    def __enter__(self) -> "IFSCDatabase":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        self.close()

    def __del__(self) -> None:
        self.close()


_db_instance: Optional[IFSCDatabase] = None


def get_database(db_path: Optional[str | Path] = None) -> Optional[IFSCDatabase]:
    """
    Return a shared database instance (singleton).

    Args:
        db_path: Optional override for the database path.

    Returns:
        IFSCDatabase instance or None if initialization fails.
    """
    global _db_instance

    with _DB_SINGLETON_LOCK:
        if _db_instance is None or (db_path and Path(db_path).resolve() != _db_instance.db_path):
            try:
                _db_instance = IFSCDatabase(db_path)
            except FileNotFoundError as err:
                logging.getLogger(APP_NAME).warning(str(err))
                _db_instance = None
            except sqlite3.DatabaseError as exc:
                logging.getLogger(APP_NAME).error("Failed to initialize database: %s", exc)
                _db_instance = None

    return _db_instance


def load_ifsc_data(_: Optional[str] = None) -> Optional[IFSCDatabase]:
    """
    Legacy compatibility wrapper for the historical JSON loader.

    Args:
        _: Ignored legacy argument retained for compatibility.

    Returns:
        IFSCDatabase instance.
    """
    return get_database()


__all__ = [
    "APP_NAME",
    "IFSCDatabase",
    "get_database",
    "load_ifsc_data",
    "normalize_ifsc_code",
]

