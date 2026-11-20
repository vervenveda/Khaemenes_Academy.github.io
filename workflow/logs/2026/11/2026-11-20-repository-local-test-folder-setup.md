# 2026-11-20 · Repository-owned offline test folder
- Repository: vervenveda/Khaemenes_Academy.github.io
- Date/timezone: 2026-11-20 · America/New_York
- Type: setup · testing process
- State: SOURCE COMMITTED / MAC RUN NOT PERFORMED

## Changes
- New `workflow/tests/README.md`: local test instructions, evidence format and no-secrets rule.
- New `workflow/tests/run-local.sh`: read-only shell preflight checks `workflow/README.md`, `workflow/INDEX.md`, `workflow/tests/README.md` and `workflow/logs/`.
- Existing `workflow/` history preserved. No actual security, integration, curriculum or native storage tests were copied or run.
- No GitHub Actions, paid scanning, cloud runner or automatic test invocation enabled.

## Mac workflow
```sh
cd /path/to/local/Academy-Home-repository
sh workflow/tests/run-local.sh
```
The `cd` path above is an example; use the actual cloned repository path. Review a test's source and run the existing approved test commands separately. Paste only sanitized evidence into this repo's dated logs, with the tested SHA. STOS tests retain their fail-closed native authority; Perl is prohibited.

## Checks
| Check | Outcome |
| --- | --- |
| Local workflow test script source committed | COMMITTED |
| Test instructions source committed | COMMITTED |
| Mac terminal preflight | NOT RUN |
| Native/academic/security tests | NOT RUN |
| Production behavior altered | NO |
| Existing workflow journals deleted | NO |

## Next
- [ ] Run offline preflight on the Mac clone and record sanitized output.
- [ ] Inventory existing repo-specific tests before moving or mirroring them; avoid duplicate authorities.
- [ ] Test actual workloads in authorized disposable environments; log true PASS/FAIL/HOLD.
