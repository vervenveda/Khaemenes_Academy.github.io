from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
checks = []

def require(path, *markers):
    p = ROOT / path
    if not p.exists():
        checks.append((False, f"missing {path}"))
        return
    text = p.read_text(encoding="utf-8")
    for marker in markers:
        checks.append((marker in text, f"{path}: {marker}"))

require("assets/khaemenes-family-registry.js",
        'const VERSION="1.1.0"',
        'grade:"12"',
        'updateLearnerPlacement',
        'learnerDestination',
        'grade-controls-stage')
require("assets/khaemenes-learner-context.js",
        'const VERSION="1.0.0"',
        'KhaemenesLearnerContext',
        'courseScope',
        'storageKey',
        'hardRedirect:false')
require("assets/khaemenes-naib-mentor-router.js",
        'const VERSION="1.2.0-transition"',
        'routeLearnerEntry',
        'changesPlacement:false',
        'awardsMastery:false')
require("assets/khaemenes-front-door-router.js",
        'const VERSION="1.1.0"',
        'KhaemenesFrontDoorRouter',
        'requiresPlacement',
        'routeForLearner',
        'continueLearner')
require("assets/khaemenes-family-school-bridge.js",
        'const VERSION="2.0.1"',
        'Different campus context',
        'hardRedirect:false',
        'khaemenes-school-bridge-ready')
require("family/enroll/index.html",
        'Exact grade placement',
        'Register Learner',
        'khaemenes-family-registry.js')
require("student/index.html",
        'Student Front Door',
        'khaemenes-learner-context.js',
        'Placement ready.',
        'Continue Learning')
require("FRONT_DOOR_PROTOCOL_V2.md",
        'Family → learner identity → exact grade',
        'No evidence engine or mentor may silently modify a grade.')
require("SCHOOL_INTEGRATION_PROTOCOL_V1.md",
        'must not create a second learner identity',
        'learner-scoped',
        'Legacy school profiles')

manifest = ROOT / "mentor-manifest.json"
try:
    payload = json.loads(manifest.read_text(encoding="utf-8"))
    ids = {r.get("id") for r in payload.get("resources", [])}
    checks.append(({"student-front-door", "family-enrollment", "teacher-admin"}.issubset(ids), "mentor-manifest front door resources"))
except Exception as exc:
    checks.append((False, f"mentor-manifest JSON: {exc}"))

failed = [label for ok, label in checks if not ok]
for ok, label in checks:
    print(("PASS" if ok else "FAIL"), label)

if failed:
    print(f"\n{len(failed)} front-door validation check(s) failed.")
    sys.exit(1)
print(f"\nPASS: {len(checks)} front-door source checks.")
