(() => {
  "use strict";

  const VERSION = "1.0.0";
  const REVIEW_KEY = "khaemenes.evidence-review-holds.v1";

  const IDENTITY = Object.freeze({
    id: "archaemenes",
    name: "Archaemenes",
    title: "Scholar and Educational Mentor of Khaemenes Academy",
    motto: "Wisdom begins with curiosity.",
    domain: "education",
    audience: "educator",
    authority: Object.freeze({
      awardsMastery: false,
      changesPlacement: false,
      silentlyChangesGrades: false,
      changesLearnerIdentity: false,
      mayAdviseTeacher: true,
      mayRecommendReview: true
    })
  });

  function safeReadQueue() {
    try {
      const raw = JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
      return Array.isArray(raw) ? raw.slice(-100) : [];
    } catch {
      return [];
    }
  }

  function summarizeReviews() {
    const all = safeReadQueue();
    const open = all.filter(r => !r?.resolved);
    const byState = {};
    for (const record of open) {
      const state = String(record?.evidenceState || "unresolved");
      byState[state] = (byState[state] || 0) + 1;
    }
    return Object.freeze({ total: all.length, open: open.length, byState: Object.freeze({ ...byState }) });
  }

  function guidance(kind = "overview", context = {}) {
    const type = String(kind || "overview");
    const base = {
      mentor: IDENTITY,
      generatedAt: new Date().toISOString(),
      context: {
        stage: String(context.stage || "academy-wide").slice(0, 80),
        subject: String(context.subject || "cross-disciplinary").slice(0, 120),
        course: String(context.course || "").slice(0, 160)
      }
    };

    const messages = {
      overview: "Review evidence before conclusions. Preserve learner authorship, distinguish fact from interpretation, and document any formal correction through the course or Academy authority that owns it.",
      evidence: "When evidence conflicts with an answer key, hold the item for review. Compare source quality, independence, chronology, context, and whether the claim says more than the evidence supports.",
      mastery: "Use the course-defined mastery rule and the evidence actually collected. Mentoring may clarify, scaffold, and recommend reassessment, but it does not independently award mastery.",
      placement: "Placement remains an Academy decision. Use readiness and mastery evidence to inform the decision without converting a mentor recommendation into formal placement authority.",
      curriculum: "Audit the lesson or assessment for factual support, clarity, accessibility, alignment to the stated objective, and whether the task measures the form of mastery it claims to measure.",
      learner: "Start with the smallest useful clue, invite the learner's reasoning, use worked examples only when needed, and reduce scaffolding as understanding strengthens."
    };

    return Object.freeze({ ...base, kind: type, guidance: messages[type] || messages.overview });
  }

  function request(kind = "overview", context = {}) {
    const brief = guidance(kind, context);
    window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-advisor-request", { detail: brief }));
    return brief;
  }

  function status() {
    return Object.freeze({
      version: VERSION,
      connected: true,
      mode: "academy-local-advisor",
      mentor: IDENTITY,
      reviews: summarizeReviews(),
      protectedCoreImported: false
    });
  }

  window.KhaemenesArchaemenesAdvisor = Object.freeze({
    version: VERSION,
    identity: IDENTITY,
    status,
    summarizeReviews,
    guidance,
    request
  });

  window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-advisor-ready", {
    detail: { version: VERSION, mentor: IDENTITY.name, mode: "academy-local-advisor" }
  }));
})();
