# Release Process

This guide covers the release process for IFSCFinder packages.

## Versioning

IFSCFinder follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking API changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Version Format

```
MAJOR.MINOR.PATCH
```

Example: `0.1.0`

## Release Checklist

### Pre-Release

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated
- [ ] License and copyright verified

### Release Steps

1. **Update Version Numbers**

   **Python:**
   ```toml
   # pyproject.toml
   version = "0.1.0"
   ```

   **TypeScript:**
   ```json
   // package.json
   "version": "0.1.0"
   ```

2. **Update CHANGELOG.md**

   Add release notes:
   ```markdown
   ## [0.1.0] - 2024-11-10

   ### Added
   - Initial release
   - Python implementation
   - TypeScript implementation
   ```

3. **Run Tests**

   ```bash
   # Python
   cd python
   pytest

   # TypeScript
   cd clients/typescript
   npm test
   ```

4. **Build Packages**

   ```bash
   # Python
   cd python
   python -m build

   # TypeScript
   cd clients/typescript
   npm run build
   ```

5. **Verify Builds**

   ```bash
   # Python
   twine check dist/*

   # TypeScript
   npm pack --dry-run
   ```

6. **Create Git Tag**

   ```bash
   git tag -a v0.1.0 -m "Release version 0.1.0"
   git push origin v0.1.0
   ```

7. **Publish Packages**

   ```bash
   # Python (PyPI)
   cd python
   twine upload dist/*

   # TypeScript (npm)
   cd clients/typescript
   npm publish
   ```

8. **Create GitHub Release**

   - Go to GitHub Releases
   - Create new release
   - Use tag `v0.1.0`
   - Add release notes from CHANGELOG.md

## Release Automation

### GitHub Actions

Automated release workflows:

- **Python**: `.github/workflows/python-release.yml`
- **TypeScript**: `.github/workflows/npm-release.yml`

### Automated Steps

1. **Version Bump**: Automatic version bump
2. **Build**: Automatic package building
3. **Test**: Automatic test execution
4. **Publish**: Automatic package publishing
5. **Release**: Automatic GitHub release creation

## Release Notes

### Format

```markdown
## [Version] - Date

### Added
- New features

### Changed
- Changes to existing features

### Fixed
- Bug fixes

### Removed
- Removed features
```

### Example

```markdown
## [0.1.0] - 2024-11-10

### Added
- Initial release
- Python implementation with SQLite backend
- TypeScript implementation with better-sqlite3
- Comprehensive API documentation
- Performance benchmarks

### Changed
- None (initial release)

### Fixed
- None (initial release)

### Removed
- None (initial release)
```

## Post-Release

### Verification

1. **Package Installation**

   ```bash
   # Python
   pip install ifscfinder

   # TypeScript
   npm install ifscfinder-ts
   ```

2. **Functionality Test**

   ```python
   from ifscfinder import lookup
   details = lookup("SBIN0000001")
   assert details is not None
   ```

3. **Documentation Check**

   - Verify documentation is up to date
   - Check all links work
   - Verify examples run correctly

### Communication

1. **Announcement**: Post release announcement
2. **Documentation**: Update documentation site
3. **Community**: Notify community of release

## Hotfix Releases

### Process

1. **Create Hotfix Branch**

   ```bash
   git checkout -b hotfix/0.1.1
   ```

2. **Fix Bug**

   - Make minimal changes
   - Add test for fix
   - Update CHANGELOG.md

3. **Release**

   - Follow normal release process
   - Increment PATCH version

## Major Releases

### Process

1. **Planning**

   - Review breaking changes
   - Plan migration path
   - Update documentation

2. **Deprecation**

   - Deprecate old APIs
   - Provide migration guide
   - Set deprecation timeline

3. **Release**

   - Follow normal release process
   - Increment MAJOR version
   - Provide migration guide

## Release Schedule

### Regular Releases

- **Minor Releases**: Monthly (new features)
- **Patch Releases**: As needed (bug fixes)
- **Major Releases**: As needed (breaking changes)

### Release Calendar

- **Q1**: Focus on stability
- **Q2**: Focus on features
- **Q3**: Focus on performance
- **Q4**: Focus on documentation

## Release Communication

### Channels

1. **GitHub Releases**: Official release notes
2. **Documentation**: Update documentation site
3. **Community**: Notify in discussions
4. **Email**: Notify maintainers

### Content

- **What's New**: New features and improvements
- **Breaking Changes**: Breaking changes and migration
- **Bug Fixes**: Fixed bugs and issues
- **Performance**: Performance improvements

