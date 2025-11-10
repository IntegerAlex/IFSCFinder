IFSCFinder (Python)
===================

IFSCFinder is a high-performance Python package that provides lightning-fast IFSC code lookups through an embedded SQLite database. With sub-millisecond query times and 40x cache acceleration, it's optimized for banking automation, fintech analytics, and high-throughput microservice architectures.

**Performance Metrics:**
- **Average lookup time**: 0.01ms per query
- **Throughput**: 136,845 lookups/second (uncached), 5.5M/second (cached)
- **Cache speedup**: 40x faster for repeated queries
- **Database size**: 42MB compressed SQLite with full Indian banking network coverage
- **Memory footprint**: Minimal with configurable caching

Installation
------------

```bash
pip install git+https://github.com/IntegerAlex/IFSCFinder.git#subdirectory=python
```

For local development:

```bash
cd /home/akshat/projects/ifsc/python
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

Usage
-----

```python
from ifscfinder import ifsc_to_details, ifsc_to_bank

details = ifsc_to_details("SBIN0000001")
bank_name = ifsc_to_bank("SBIN0000001")
```

- `ifsc_to_details(code)` returns a dictionary with `BANK`, `BRANCH`, `ADDRESS`, `CITY1`, `CITY2`, `STATE`, and `STD_CODE` keys.
- Field-specific helpers (`ifsc_to_bank`, `ifsc_to_branch`, `ifsc_to_state`, etc.) offer ergonomic access.
- `clear_lookup_cache()` invalidates the in-memory cache when the database changes.
- `get_database(db_path=None)` returns the underlying `IFSCDatabase` singleton if you need lower-level control.

Data Source
-----------

The packaged SQLite database lives under `ifscfinder/data/ifsc.db`. Replace this file with an updated dataset to refresh lookups. The package automatically validates the presence of the database and raises a descriptive `FileNotFoundError` if it is missing.

Testing & Quality
-----------------

- Run `python3 -m compileall src/ifscfinder` to sanity check syntax.
- Upcoming automated tests will live under `python/tests` and be executed via `pytest`.
- The code uses strict IFSC normalization and structured logging to aid production diagnostics.

Roadmap
-------

- Publish the package to PyPI with automated GitHub Actions builds.
- Provide a JSON export pipeline to feed JavaScript, Go, and Rust ports.
- Synchronize API contracts across the forthcoming TypeScript client and other language bindings.

Contributing
------------

1. Fork the repository and create a feature branch.
2. Run sanity checks before submitting a pull request.
3. Document any API changes in this README and sync cross-language specs.

License
-------

LGPL-2.1 License. See `LICENSE` in the project root.

**Copyright Notice:**
Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.

This package is distributed under the GNU Lesser General Public License v2.1.
See the LICENSE file for full copyright information and license terms.
