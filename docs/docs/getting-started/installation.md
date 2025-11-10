# Installation

IFSCFinder is available for multiple programming languages. Choose the one that fits your project.

## Python

```bash
pip install ifscfinder
```

Or install from GitHub:

```bash
pip install git+https://github.com/IntegerAlex/IFSCFinder.git#subdirectory=python
```

**Requirements:**
- Python >= 3.7
- No additional dependencies required

## TypeScript/Node.js

```bash
npm install ifscfinder-ts
```

**Note for pnpm users**: `better-sqlite3` requires native bindings. After installation, run:

```bash
pnpm rebuild better-sqlite3
```

**Requirements:**
- Node.js >= 18
- No additional dependencies required (better-sqlite3 included)

## Go

Coming soon! The Go port is in development.

## Rust

Coming soon! The Rust port is in development.

## Verification

After installation, verify that the package works:

### Python

```python
from ifscfinder import lookup

details = lookup("SBIN0000001")
print(details)
```

### TypeScript

```typescript
import { lookup } from 'ifscfinder-ts';

const details = lookup('SBIN0000001');
console.log(details);
```

## Troubleshooting

### Python: Database not found

If you see a `FileNotFoundError`, ensure the database file is included in the package installation.

### TypeScript: Native module errors

If using pnpm, rebuild the native module:

```bash
pnpm rebuild better-sqlite3
```

Or use npm instead of pnpm for automatic native module compilation.

