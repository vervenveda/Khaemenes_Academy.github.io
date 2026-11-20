# Local Workflow Tests — vervenveda/Khaemenes_Academy.github.io

## Purpose
This directory holds repository-owned test instructions and explicitly authorized local test assets. Run tests from your Mac Terminal after reviewing their source. **No paid CI runner, hosted scanning subscription, or external test service is necessary for this workflow preflight.**

## Mac terminal
```sh
git clone <authorized repository URL>
cd <repository folder>
sh workflow/tests/run-local.sh
```
The `run-local.sh` preflight is **offline, read-only**, and checks only the presence of the repository's workflow scaffolding. It does **not** run any existing security tests and does not establish a PASS for protected services. Run approved actual test scripts by their documented command, then capture sanitized outputs in `workflow/logs/YYYY/MM/` and update `workflow/INDEX.md`.

## Test record conventions
- Describe the exact command, script path, working tree commit SHA, host/test environment and expected behavior.
- Mark PASS only when an actual test ran and its output was inspected. Use FAIL, HOLD, NOT RUN, or PARTIAL otherwise.
- Store synthetic fixtures only; no learner data, customer records, real emails, credentials, session identifiers, network endpoint secrets, or personal addresses.
- Prefer native C17, POSIX shell, bounded read-only checks and existing approved test executables. Perl is prohibited in STOS terminal workflows.
- Do not modify production services or storage to make a test pass; use disposable test environments for fault injection.
- Never activate GitHub Actions, a paid scanner, or deployment automatically via this folder.

## Logging template
```text
Date:
Repository / commit:
Test script and exact command:
Machine / synthetic fixture:
Mode: read-only / disposable lab
Result: PASS / FAIL / HOLD / NOT RUN
Sanitized evidence:
Side effects: none / list
Next actions:
```
