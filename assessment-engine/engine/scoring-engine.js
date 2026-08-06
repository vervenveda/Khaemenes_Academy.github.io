function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function asSet(value) {
  return new Set(Array.isArray(value) ? value.map(String) : []);
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

function scoreSingleChoice(item, response) {
  const correct = String(response) === String(item.correctAnswer);
  return {
    earned: correct ? item.points : 0,
    normalized: correct ? 1 : 0,
    status: correct ? "correct" : "incorrect"
  };
}

function scoreMultiSelect(item, response) {
  const selected = asSet(response);
  const expected = asSet(item.correctAnswer);
  const correct = setsEqual(selected, expected);

  if (correct) {
    return { earned: item.points, normalized: 1, status: "correct" };
  }

  if (!item.partialCredit) {
    return { earned: 0, normalized: 0, status: "incorrect" };
  }

  const truePositive = [...selected].filter(value => expected.has(value)).length;
  const falsePositive = [...selected].filter(value => !expected.has(value)).length;
  const ratio = clamp((truePositive - falsePositive) / Math.max(expected.size, 1));

  return {
    earned: +(item.points * ratio).toFixed(2),
    normalized: ratio,
    status: ratio > 0 ? "partial" : "incorrect"
  };
}

function scoreNumeric(item, response) {
  const number = Number(response);
  if (!Number.isFinite(number)) {
    return { earned: 0, normalized: 0, status: "invalid" };
  }

  const answer = Number(item.correctAnswer);
  const tolerance = Number(item.tolerance || 0);
  const correct = Math.abs(number - answer) <= tolerance;

  return {
    earned: correct ? item.points : 0,
    normalized: correct ? 1 : 0,
    status: correct ? "correct" : "incorrect"
  };
}

function scoreLikert(item, response) {
  const value = Number(response);
  const min = Number(item.scale?.min ?? 1);
  const max = Number(item.scale?.max ?? 5);
  const normalized = clamp((value - min) / Math.max(max - min, 1));

  return {
    earned: 0,
    normalized,
    status: "exploratory",
    nonGraded: true
  };
}

function scoreManual(item) {
  return {
    earned: 0,
    normalized: null,
    status: "manual-review",
    manualReview: true
  };
}

export function scoreResponse(item, response) {
  const points = Number(item.points ?? 1);
  const base = { possible: points };

  let score;
  switch (item.type) {
    case "single-choice":
      score = scoreSingleChoice({ ...item, points }, response);
      break;
    case "multi-select":
      score = scoreMultiSelect({ ...item, points }, response);
      break;
    case "numeric":
      score = scoreNumeric({ ...item, points }, response);
      break;
    case "likert":
      score = scoreLikert({ ...item, points }, response);
      break;
    case "short-response":
    case "extended-response":
    case "performance":
      score = scoreManual({ ...item, points }, response);
      break;
    default:
      throw new Error(`Unsupported item type: ${item.type}`);
  }

  const domainEvidence = (item.domains || []).map(domain => ({
    id: typeof domain === "string" ? domain : domain.id,
    weight: typeof domain === "string" ? 1 : Number(domain.weight ?? 1),
    normalized: score.normalized,
    status: score.status
  }));

  return {
    ...base,
    ...score,
    itemId: item.id,
    domains: domainEvidence,
    standards: item.standards || [],
    misconceptions: score.status === "incorrect"
      ? (item.misconceptionTags || [])
      : [],
    scoredAt: new Date().toISOString()
  };
}

export function aggregateMastery(evidence = []) {
  const domains = {};

  for (const record of evidence) {
    for (const domain of record.domains || []) {
      if (domain.normalized == null) continue;
      const id = domain.id;
      const weight = Math.max(0.01, Number(domain.weight || 1));
      const difficulty = clamp(Number(record.difficulty ?? 0.5), 0, 1);
      const difficultyWeight = 0.75 + (difficulty * 0.5);
      const effectiveWeight = weight * difficultyWeight;

      if (!domains[id]) {
        domains[id] = {
          weightedTotal: 0,
          weightTotal: 0,
          attempts: 0,
          lastEvidenceAt: null
        };
      }

      domains[id].weightedTotal += domain.normalized * effectiveWeight;
      domains[id].weightTotal += effectiveWeight;
      domains[id].attempts += 1;
      domains[id].lastEvidenceAt = record.scoredAt || null;
    }
  }

  return Object.fromEntries(
    Object.entries(domains).map(([id, data]) => {
      const mastery = data.weightTotal
        ? data.weightedTotal / data.weightTotal
        : 0;
      const confidence = clamp(data.attempts / 5);

      return [id, {
        mastery: +mastery.toFixed(3),
        confidence: +confidence.toFixed(3),
        attempts: data.attempts,
        lastEvidenceAt: data.lastEvidenceAt
      }];
    })
  );
}

export function summarizeAttempt(attempt, assessment) {
  const objectiveEvidence = attempt.evidence.filter(record => !record.nonGraded && !record.manualReview);
  const earned = objectiveEvidence.reduce((sum, record) => sum + Number(record.earned || 0), 0);
  const possible = objectiveEvidence.reduce((sum, record) => sum + Number(record.possible || 0), 0);
  const manualReviewCount = attempt.evidence.filter(record => record.manualReview).length;

  return {
    assessmentId: assessment.id,
    attemptId: attempt.id,
    completedAt: attempt.completedAt || new Date().toISOString(),
    answered: Object.keys(attempt.responses || {}).length,
    objectivePercent: possible ? Math.round((earned / possible) * 100) : null,
    earned: +earned.toFixed(2),
    possible: +possible.toFixed(2),
    manualReviewCount,
    mastery: aggregateMastery(attempt.evidence),
    standardsObserved: [...new Set(attempt.evidence.flatMap(record => record.standards || []))]
  };
}
