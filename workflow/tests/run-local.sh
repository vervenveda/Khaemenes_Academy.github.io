#!/bin/sh
# Repository-local, offline workflow preflight. Run from any directory.
# No network, no package manager, no production mutation, no secrets.
set -eu
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)
cd "$ROOT"
printf '%s\n' "=== REPOSITORY WORKFLOW PREFLIGHT ==="
printf 'ROOT=%s\n' "$ROOT"
test -f workflow/README.md || { printf '%s\n' "FAIL: workflow/README.md missing"; exit 1; }
test -f workflow/INDEX.md || { printf '%s\n' "FAIL: workflow/INDEX.md missing"; exit 1; }
test -f workflow/tests/README.md || { printf '%s\n' "FAIL: workflow/tests/README.md missing"; exit 1; }
test -d workflow/logs || { printf '%s\n' "FAIL: workflow/logs/ missing"; exit 1; }
printf '%s\n' "PASS: workflow documentation and log directory present"
printf '%s\n' "MODE=OFFLINE_READ_ONLY"
printf '%s\n' "NOTE: No product/security tests executed. Run each approved repository test explicitly using its documented commands."
