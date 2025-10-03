#!/usr/bin/env bash
set -euo pipefail

# Complete release helper - combines version bump, changelog update, and release
# Usage: ./scripts/release_helper.sh [patch|minor|major] "Release description"

TYPE=${1:-}
DESCRIPTION=${2:-}

if [[ ! "$TYPE" =~ ^(patch|minor|major)$ ]] || [[ -z "$DESCRIPTION" ]]; then
    echo "Usage: $0 [patch|minor|major] \"Release description\""
    echo ""
    echo "Example:"
    echo "  $0 patch \"Fix SEO issues and add new calculator\""
    echo "  $0 minor \"Add QR code generator and material database\""
    exit 1
fi

# Run version manager
./scripts/version_manager.sh "$TYPE"

# Get the new version
NEW_VERSION=$(git describe --tags --abbrev=0)
echo ""
echo "Updating CHANGELOG.md..."

# Update CHANGELOG with new version
DATE=$(date +%Y-%m-%d)
TEMP_CHANGELOG=$(mktemp)

# Create new changelog entry
cat > "$TEMP_CHANGELOG" << EOF
# Changelog

All notable changes to this project will be documented in this file.

## $NEW_VERSION - $DATE
- $DESCRIPTION

EOF

# Append existing changelog (skip the first 4 lines - header and first entry)
if [[ -f CHANGELOG.md ]]; then
    tail -n +5 CHANGELOG.md >> "$TEMP_CHANGELOG"
fi

mv "$TEMP_CHANGELOG" CHANGELOG.md

# Commit changelog update
git add CHANGELOG.md
git commit --amend --no-edit

# Push everything
echo ""
echo "Pushing to remote..."
git push origin main
git push origin "$NEW_VERSION"

# Create GitHub release
echo ""
echo "Creating GitHub release..."
gh release create "$NEW_VERSION" --title "$NEW_VERSION" --notes "$DESCRIPTION"

echo ""
echo "✅ Release $NEW_VERSION completed!"
echo "🔗 Check: https://github.com/$(gh repo view --json owner,name -q '.owner.login + \"/\" + .name')/releases/tag/$NEW_VERSION"
