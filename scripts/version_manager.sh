#!/usr/bin/env bash
set -euo pipefail

# Version manager for personal projects
# Usage: ./scripts/version_manager.sh [patch|minor|major]

TYPE=${1:-}
if [[ ! "$TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo "Usage: $0 [patch|minor|major]"
    echo ""
    echo "Current version info:"
    echo "  Git tag: $(git describe --tags --abbrev=0 2>/dev/null || echo 'none')"
    echo "  package.json: $(grep '"version"' package.json | cut -d'"' -f4)"
    echo ""
    echo "Examples:"
    echo "  $0 patch   # v0.1.0 -> v0.1.1 (bug fixes)"
    echo "  $0 minor   # v0.1.1 -> v0.2.0 (new features)"
    echo "  $0 major   # v0.2.0 -> v1.0.0 (breaking changes)"
    exit 1
fi

# Get current version from git tags
CURRENT=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
echo "Current version: $CURRENT"

# Parse version numbers
if [[ $CURRENT =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
    MAJOR=${BASH_REMATCH[1]}
    MINOR=${BASH_REMATCH[2]}
    PATCH=${BASH_REMATCH[3]}
else
    echo "Invalid version format: $CURRENT"
    exit 1
fi

# Calculate new version
case $TYPE in
    patch)
        NEW_PATCH=$((PATCH + 1))
        NEW_VERSION="v${MAJOR}.${MINOR}.${NEW_PATCH}"
        ;;
    minor)
        NEW_MINOR=$((MINOR + 1))
        NEW_VERSION="v${MAJOR}.${NEW_MINOR}.0"
        ;;
    major)
        NEW_MAJOR=$((MAJOR + 1))
        NEW_VERSION="v${NEW_MAJOR}.0.0"
        ;;
esac

echo "New version: $NEW_VERSION"
read -p "Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Update package.json
NEW_VERSION_NO_V=${NEW_VERSION#v}
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION_NO_V\"/" package.json
git add package.json

# Create commit and tag
git commit -m "chore: bump version to $NEW_VERSION"
git tag -a "$NEW_VERSION" -m "Release $NEW_VERSION"

echo "✅ Version bumped to $NEW_VERSION"
echo "Next steps:"
echo "  git push origin main"
echo "  git push origin $NEW_VERSION"
