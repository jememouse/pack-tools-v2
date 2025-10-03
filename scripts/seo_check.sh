#!/usr/bin/env bash
set -euo pipefail

# Simple SEO checker (read-only)
# Usage: BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh

BASE_URL=${BASE_URL:-}
if [[ -z "$BASE_URL" ]]; then
  echo "[ERROR] Please set BASE_URL, e.g.: BASE_URL=https://tools.heyijiapack.com ./scripts/seo_check.sh" >&2
  exit 1
fi

say() { printf "\n==> %s\n" "$*"; }
check() { printf "[OK] %s\n" "$*"; }
warn() { printf "[WARN] %s\n" "$*"; }
fail() { printf "[FAIL] %s\n" "$*"; }

# Fetch helpers
fetch_head() { curl -fsSI "$1" || return 1; }
fetch_body() { curl -fsSL "$1" || return 1; }

ok=0; warnc=0; failc=0
inc_ok(){ ok=$((ok+1)); }
inc_warn(){ warnc=$((warnc+1)); }
inc_fail(){ failc=$((failc+1)); }

say "Checking: $BASE_URL"

# 1) Status code
if fetch_head "$BASE_URL" | head -n1 | grep -qE " 200 | 301 | 302 "; then
  check "Status OK (200/3xx)"
  inc_ok
else
  fail "Unexpected status"
  inc_fail
fi

# 2) Basic meta tags
html=$(fetch_body "$BASE_URL" || true)
if [[ -z "$html" ]]; then
  fail "Failed to fetch HTML"
  inc_fail
else
  echo "$html" | grep -qi "<title>" && { check "<title> present"; inc_ok; } || { warn "<title> missing"; inc_warn; }
  echo "$html" | grep -qi "<meta[^>]*name=\"description\"" && { check "meta description present"; inc_ok; } || { warn "meta description missing"; inc_warn; }
  echo "$html" | grep -qi "<link[^>]*rel=\"canonical\"" && { check "canonical present"; inc_ok; } || { warn "canonical missing"; inc_warn; }
  echo "$html" | grep -qi "property=\"og:title\"" && { check "OG title present"; inc_ok; } || { warn "OG title missing"; inc_warn; }
  echo "$html" | grep -qi "type=\"application/ld\+json\"" && { check "JSON-LD present"; inc_ok; } || { warn "JSON-LD missing"; inc_warn; }
fi

# 3) robots.txt
if fetch_head "$BASE_URL/robots.txt" >/dev/null 2>&1; then
  check "robots.txt accessible"
  inc_ok
else
  warn "robots.txt not accessible"
  inc_warn
fi

# 4) sitemap.xml
if fetch_head "$BASE_URL/sitemap.xml" >/dev/null 2>&1; then
  check "sitemap.xml accessible"
  inc_ok
else
  warn "sitemap.xml not accessible"
  inc_warn
fi

say "Summary: OK=$ok WARN=$warnc FAIL=$failc"

# exit non-zero if any FAIL
if [[ $failc -gt 0 ]]; then
  exit 2
fi
