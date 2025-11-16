IFSC Platform
=============

[![PyPI Downloads](https://img.shields.io/pypi/dm/ifscfinder?label=PyPI%20Downloads&logo=pypi&logoColor=white)](https://pypi.org/project/ifscfinder/)
[![npm Downloads](https://img.shields.io/npm/dm/ifscfinder-ts?label=npm%20Downloads&logo=npm&logoColor=white)](https://www.npmjs.com/package/ifscfinder-ts)
[![License: LGPL-2.1](https://img.shields.io/badge/License-LGPL--2.1-blue.svg)](https://www.gnu.org/licenses/lgpl-2.1.html)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/IntegerAlex/IFSCFinder/.github/workflows/main.yml?branch=master&logo=github-actions&logoColor=white)](https://github.com/IntegerAlex/IFSCFinder/actions)
[![GitHub Stars](https://img.shields.io/github/stars/IntegerAlex/IFSCFinder?logo=github)](https://github.com/IntegerAlex/IFSCFinder)
[![GitHub Forks](https://img.shields.io/github/forks/IntegerAlex/IFSCFinder?logo=github)](https://github.com/IntegerAlex/IFSCFinder)
[![Python Version](https://img.shields.io/pypi/pyversions/ifscfinder?logo=python&logoColor=white)](https://pypi.org/project/ifscfinder/)
[![Node Version](https://img.shields.io/node/v/ifscfinder-ts?logo=node.js&logoColor=white)](https://www.npmjs.com/package/ifscfinder-ts)

This repository hosts the cross-platform IFSCFinder initiative - a comprehensive suite for high-performance IFSC code lookups across multiple programming languages. The Python package serves as the canonical implementation, providing sub-millisecond query performance with a 42MB embedded database covering India's complete banking network.

**Key Features:**
- **Cross-platform compatibility** with consistent APIs across Python, JavaScript, Go, and Rust
- **Production-grade performance** with 136K+ lookups/second and 40x cache acceleration
- **Embedded database** eliminating external dependencies for seamless deployment
- **Comprehensive coverage** of all Indian banks and their branches
- **LGPL-2.1 licensed** for flexible commercial and open-source usage

Project Structure
-----------------

- `python/`: Source for the canonical IFSCFinder package (`src/ifscfinder`). Ships with an embedded `ifsc.db`.
- `data-pipelines/` *(planned)*: Scripts to refresh IFSC data and export language-specific bundles.
- `clients/` *(planned)*: TypeScript, Go, and Rust SDKs that share API parity with the Python package.
- `docs/` *(planned)*: Architecture reference, API contracts, and contribution guidelines.

Getting Started (Python)
------------------------

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
python3 -m compileall src/ifscfinder
```

Vision & Roadmap
----------------

- Maintain a single source of truth for IFSC data and validation rules at [https://github.com/IntegerAlex/IFSCFinder](https://github.com/IntegerAlex/IFSCFinder).
- Provide modular backend services that expose REST and GraphQL endpoints with RBAC and JWT.
- Offer client libraries for browser and server environments with built-in caching and telemetry.
- Integrate CI/CD pipelines (GitHub Actions) for automated testing, linting, and packaging across languages.
- Publish comprehensive documentation and security guidelines covering input validation, query optimization, and logging standards.

Contributing
------------

1. Open an issue or discussion for any proposed changes.
2. Follow language-specific contribution guides (`python/README.md`, upcoming `clients/<lang>/README.md`).
3. Ensure data-validation tests pass and update shared contracts before merging.

License
-------

LGPL-2.1 License. See `LICENSE` in the project root.

**Copyright Notice:**
Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.

This project is distributed under the GNU Lesser General Public License v2.1.
See the LICENSE file for full copyright information and license terms.

