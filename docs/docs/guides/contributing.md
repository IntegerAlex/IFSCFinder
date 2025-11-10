# Contributing

Thank you for your interest in contributing to IFSCFinder! This guide will help you get started.

## Getting Started

### Prerequisites

- Git
- Python 3.7+ (for Python contributions)
- Node.js 18+ (for TypeScript contributions)
- Basic understanding of the project structure

### Development Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/IntegerAlex/IFSCFinder.git
   cd IFSCFinder/docs
   ```

## Contribution Guidelines

### Code Style

#### Python

- Follow PEP 8 style guide
- Use type hints
- Maximum line length: 88 characters
- Use Black for formatting

```bash
black src/ifscfinder tests/
```

#### TypeScript

- Follow ESLint rules
- Use TypeScript strict mode
- Maximum line length: 88 characters
- Use Prettier for formatting

```bash
npm run lint
npm run format
```

### Commit Messages

Follow conventional commits:

```
feat: Add new search functionality
fix: Fix cache invalidation bug
docs: Update API documentation
test: Add performance benchmarks
refactor: Simplify database provider
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run tests**
   ```bash
   # Python
   cd python
   pytest

   # TypeScript
   cd clients/typescript
   npm test
   ```

4. **Submit pull request**
   - Clear description of changes
   - Reference related issues
   - Include test results

### Testing Requirements

All contributions must include:

- **Unit tests**: Test new functionality
- **Integration tests**: Test with real database
- **Performance tests**: Ensure performance targets met
- **Parity tests**: Ensure API parity maintained

### Documentation Requirements

All contributions must include:

- **Code comments**: Document complex logic
- **API documentation**: Update function docs
- **Examples**: Add usage examples
- **Changelog**: Update CHANGELOG.md

## Areas for Contribution

### High Priority

1. **Go Implementation**: Port to Go
2. **Rust Implementation**: Port to Rust
3. **Browser Support**: WebAssembly SQLite
4. **Performance Optimization**: Further optimizations

### Medium Priority

1. **Additional Search Features**: Advanced search options
2. **Data Export**: Export to various formats
3. **API Enhancements**: Additional helper functions
4. **Documentation**: Improve documentation

### Low Priority

1. **Examples**: More usage examples
2. **Tutorials**: Step-by-step tutorials
3. **Blog Posts**: Technical blog posts
4. **Community**: Help with issues and discussions

## Code Review Process

### Review Criteria

- **Functionality**: Code works as intended
- **Performance**: Meets performance targets
- **Testing**: Comprehensive test coverage
- **Documentation**: Clear and complete
- **Style**: Follows style guidelines
- **Parity**: Maintains API parity

### Review Timeline

- Initial review: Within 2-3 business days
- Follow-up reviews: Within 1-2 business days
- Merge: After approval and CI passing

## Questions?

- **GitHub Issues**: Open an issue for questions
- **Discussions**: Use GitHub Discussions
- **Email**: Contact maintainers directly

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints

### Enforcement

Violations will be addressed by maintainers. Please follow the standards outlined above.

## License

By contributing, you agree that your contributions will be licensed under the LGPL-2.1 License.

