function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function randomUnit() {
  if (globalThis.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return array[0] / 4294967296;
  }
  return Math.random();
}

function itemDomainIds(item) {
  return (item.domains || []).map(domain =>
    typeof domain === "string" ? domain : domain.id
  );
}

function mean(values, fallback = 0) {
  return values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : fallback;
}

function blueprintNeed(item, blueprint = {}, counts = {}) {
  const rules = blueprint.domains || [];
  const domains = itemDomainIds(item);

  const needs = rules
    .filter(rule => domains.includes(rule.id))
    .map(rule => {
      const current = counts[rule.id] || 0;
      const minimum = Number(rule.minItems || 0);
      return minimum > current ? 1 : 0.15;
    });

  return mean(needs, 0.3);
}

function masteryNeed(item, profile = {}) {
  const domains = itemDomainIds(item);
  const values = domains.map(id => 1 - Number(profile.mastery?.[id]?.mastery ?? 0.5));
  return mean(values, 0.5);
}

function misconceptionNeed(item, profile = {}) {
  const active = new Set(profile.activeMisconceptions || []);
  const matches = (item.misconceptionTags || []).filter(tag => active.has(tag)).length;
  return matches ? clamp(0.45 + matches * 0.2) : 0.15;
}

function challengeFit(item, profile = {}) {
  const target = Number(profile.targetDifficulty ?? 0.5);
  const difficulty = Number(item.difficulty ?? 0.5);
  return clamp(1 - Math.abs(target - difficulty));
}

function interestFit(item, profile = {}) {
  const interests = new Set(profile.interests || []);
  const tags = item.interestTags || [];
  if (!tags.length || !interests.size) return 0.35;
  return clamp(tags.filter(tag => interests.has(tag)).length / tags.length);
}

function exposureFactor(item, profile = {}) {
  const count = Number(profile.exposureCounts?.[item.id] || 0);
  const limit = Number(item.exposureLimit || 3);
  if (count >= limit) return 0;
  return 1 / (1 + count);
}

function prerequisitesMet(item, profile = {}) {
  const required = item.prerequisites || [];
  return required.every(id => Number(profile.mastery?.[id]?.mastery ?? 0) >= 0.55);
}

function isEligible(item, context) {
  if (context.answeredIds.has(item.id)) return false;
  if (item.active === false) return false;

  if (context.mode === "formal") {
    return item.formalAssessmentEligible !== false;
  }

  if (item.adaptiveEligible === false) return false;
  if (!prerequisitesMet(item, context.profile)) return false;
  return exposureFactor(item, context.profile) > 0;
}

function selectionWeight(item, context) {
  const weights = context.policy || {};
  const need =
    masteryNeed(item, context.profile) * (weights.masteryNeed ?? 0.32) +
    blueprintNeed(item, context.blueprint, context.domainCounts) * (weights.blueprintNeed ?? 0.22) +
    misconceptionNeed(item, context.profile) * (weights.misconceptionNeed ?? 0.16) +
    challengeFit(item, context.profile) * (weights.challengeFit ?? 0.14) +
    interestFit(item, context.profile) * (weights.interestFit ?? 0.08) +
    exposureFactor(item, context.profile) * (weights.exposureControl ?? 0.08);

  return Math.max(0.0001, need);
}

function weightedSample(entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = randomUnit() * total;

  for (const entry of entries) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.item;
  }

  return entries.at(-1)?.item || null;
}

export function selectNextItem({
  items,
  answeredIds = [],
  mode = "diagnostic",
  profile = {},
  blueprint = {},
  domainCounts = {},
  policy = {}
}) {
  const context = {
    answeredIds: new Set(answeredIds),
    mode,
    profile,
    blueprint,
    domainCounts,
    policy
  };

  const eligible = items.filter(item => isEligible(item, context));
  if (!eligible.length) return null;

  // Formal verification uses stable order. Randomness is never allowed
  // to alter the grading scale or remove required blueprint content.
  if (mode === "formal") {
    return [...eligible].sort((a, b) =>
      Number(a.order ?? 9999) - Number(b.order ?? 9999)
      || a.id.localeCompare(b.id)
    )[0];
  }

  return weightedSample(
    eligible.map(item => ({
      item,
      weight: selectionWeight(item, context)
    }))
  );
}

export function countDomainEvidence(evidence = []) {
  const counts = {};
  for (const record of evidence) {
    for (const domain of record.domains || []) {
      counts[domain.id] = (counts[domain.id] || 0) + 1;
    }
  }
  return counts;
}
