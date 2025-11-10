# Development Guide

This guide covers the development setup and workflow for IFSCFinder.

## Development Environment

### Python Development

#### Setup

```bash
cd python
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
```

#### Development Dependencies

```bash
pip install -e ".[dev]"
```

Includes:
- `pytest` - Testing framework
- `black` - Code formatting
- `flake8` - Linting
- `mypy` - Type checking
- `build` - Package building
- `twine` - Package publishing

#### Running Tests

```bash
pytest
```

#### Type Checking

```bash
mypy src/ifscfinder
```

#### Code Formatting

```bash
black src/ifscfinder tests/
```

### TypeScript Development

#### Setup

```bash
cd clients/typescript
npm install
```

#### Development Dependencies

Includes:
- `vitest` - Testing framework
- `typescript` - Type checking
- `eslint` - Linting
- `tsup` - Build tool
- `tsx` - TypeScript execution

#### Running Tests

```bash
npm test
```

#### Type Checking

```bash
npm run typecheck
```

#### Building

```bash
npm run build
```

## Project Structure

### Python Structure

```
python/
├── src/ifscfinder/
│   ├── __init__.py
│   ├── main.py          # Database provider
│   ├── utils.py          # Helper functions
│   └── data/
│       └── ifsc.db       # Embedded database
├── tests/
│   ├── test_lookup.py
│   └── test_search.py
└── pyproject.toml
```

### TypeScript Structure

```
clients/typescript/
├── src/
│   ├── index.ts          # Public API
│   ├── db.ts             # Database provider
│   ├── cache.ts          # LRU cache
│   ├── normalize.ts      # Validation
│   ├── search.ts         # Search implementation
│   └── types.ts          # TypeScript types
├── tests/
│   ├── lookup.spec.ts
│   └── search.spec.ts
└── package.json
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Write code
- Add tests
- Update documentation

### 3. Run Tests

```bash
# Python
cd python
pytest

# TypeScript
cd clients/typescript
npm test
```

### 4. Check Code Quality

```bash
# Python
black src/ifscfinder tests/
flake8 src/ifscfinder tests/
mypy src/ifscfinder

# TypeScript
npm run lint
npm run typecheck
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: Add new feature"
```

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## Testing

### Unit Tests

Test individual functions:

```python
def test_lookup():
    details = lookup("SBIN0000001")
    assert details is not None
    assert details["BANK"] == "STATE BANK OF INDIA"
```

### Integration Tests

Test with real database:

```python
def test_lookup_integration():
    db = IFSCDatabase()
    details = db.lookup("SBIN0000001")
    assert details is not None
```

### Performance Tests

Test performance targets:

```python
def test_lookup_performance():
    start = time.time()
    for _ in range(1000):
        lookup("SBIN0000001")
    elapsed = time.time() - start
    assert elapsed < 0.1  # < 0.1ms per lookup
```

## Debugging

### Python Debugging

```python
import logging
logging.basicConfig(level=logging.DEBUG)

from ifscfinder import lookup
details = lookup("SBIN0000001")
```

### TypeScript Debugging

```typescript
import { lookup } from 'ifscfinder-ts';

// Use debugger
debugger;
const details = lookup('SBIN0000001');
```

## Building

### Python Package

```bash
cd python
python -m build
```

### TypeScript Package

```bash
cd clients/typescript
npm run build
```

## Publishing

### Python (PyPI)

```bash
cd python
python -m build
twine upload dist/*
```

### TypeScript (npm)

```bash
cd clients/typescript
npm run build
npm publish
```

## CI/CD

### GitHub Actions

All implementations include CI/CD workflows:

- **Python**: `.github/workflows/python-ci.yml`
- **TypeScript**: `.github/workflows/ci.yml`

### Automated Testing

- Run tests on push
- Run tests on pull requests
- Run performance benchmarks
- Check code quality

## Best Practices

### Code Quality

1. **Type Hints**: Use type hints (Python) or TypeScript types
2. **Documentation**: Document all public functions
3. **Testing**: Write tests for all new features
4. **Performance**: Meet performance targets

### Git Workflow

1. **Feature Branches**: Create feature branches
2. **Small Commits**: Make small, focused commits
3. **Clear Messages**: Write clear commit messages
4. **Pull Requests**: Create pull requests for review

### Documentation

1. **API Docs**: Update API documentation
2. **Examples**: Add usage examples
3. **Changelog**: Update CHANGELOG.md
4. **README**: Update README if needed

