(() => {
  "use strict";

  const VERSION = "1.1.0";
  const REVIEW_KEY = "khaemenes.evidence-review-holds.v1";
  const WORKFLOW_KEY = "khaemenes.teacher-advisory-workflow.v1";
  const MAX_RECORDS = 100;

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

  const PIPELINE = Object.freeze([
    "noema-evidence",
    "naib-routing",
    "teacher-review",
    "archaemenes-advisory",
    "course-or-academy-decision"
  ]);

  function clean(value, max = 1200) {
    return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
  }

  function safeRead(key) {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(raw) ? raw.slice(-MAX_RECORDS) : [];
    } catch {
      return [];
    }
  }

  function safeWrite(key, records) {
    try {
      localStorage.setItem(key, JSON.stringify(records.slice(-MAX_RECORDS)));
      return true;
    } catch {
      return false;
    }
  }

  function safeReadQueue() {
    return safeRead(REVIEW_KEY);
  }

  function summarizeReviews() {
    const all = safeReadQueue();
    const open = all.filter(r => !r?.resolved);
    const byState = {};
    for (const record of open) {
      const state = clean(record?.evidenceState || "unresolved", 80);
      byState[state] = (byState[state] || 0) + 1;
    }
    return Object.freeze({ total: all.length, open: open.length, byState: Object.freeze({ ...byState }) });
  }

  function guidance(kind = "overview", context = {}) {
    const type = clean(kind || "overview", 80);
    const base = {
      mentor: IDENTITY,
      generatedAt: new Date().toISOString(),
      context: {
        stage: clean(context.stage || "academy-wide", 80),
        subject: clean(context.subject || "cross-disciplinary", 120),
        course: clean(context.course || "", 160),
        assessmentId: clean(context.assessmentId || "", 160),
        itemId: clean(context.itemId || "", 160)
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

  function normalizeNoemaEnvelope(input = {}) {
    return Object.freeze({
      contract: "khaemenes.noema-evidence-envelope",
      contractVersion: 1,
      receivedAt: new Date().toISOString(),
      source: "Noema",
      evidenceState: clean(input.evidenceState || input.state || "unresolved", 80),
      confidenceBand: clean(input.confidenceBand || "low", 40),
      subject: clean(input.subject || "cross-disciplinary", 120),
      course: clean(input.course || "", 160),
      assessmentId: clean(input.assessmentId || "", 160),
      itemId: clean(input.itemId || "", 160),
      summary: clean(input.summary || input.note || "Evidence review submitted for teacher interpretation.", 1200),
      contradictionPresent: input.contradictionPresent === true || input.contradictionsPresent === true,
      uncertaintyPresent: input.uncertaintyPresent !== false,
      privacy: Object.freeze({
        containsLearnerIdentity: false,
        containsCredentials: false,
        containsPrivateRouting: false,
        containsHiddenReasoning: false
      })
    });
  }

  function routeThroughNAIB(envelope) {
    return Object.freeze({
      contract: "khaemenes.naib-teacher-routing",
      contractVersion: 1,
      routedAt: new Date().toISOString(),
      routedBy: "NAIB",
      destination: "Khaemenes Academy Teacher Administration",
      purpose: "evidence-and-instructional-review",
      evidence: envelope,
      authority: Object.freeze({
        awardsMastery: false,
        changesPlacement: false,
        silentlyChangesGrade: false,
        changesLearnerIdentity: false
      })
    });
  }

  function createTeacherWorkflow(input = {}) {
    const evidence = normalizeNoemaEnvelope(input);
    const route = routeThroughNAIB(evidence);
    const record = {
      contract: "khaemenes.teacher-advisory-workflow",
      contractVersion: 1,
      workflowId: clean(input.workflowId || `teacher-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, 120),
      createdAt: new Date().toISOString(),
      stage: "teacher-review",
      pipeline: [...PIPELINE],
      noema: evidence,
      naib: route,
      teacher: {
        status: "pending-review",
        decision: "",
        note: ""
      },
      archaemenes: null,
      finalAuthority: "course-or-academy-owner"
    };
    const records = safeRead(WORKFLOW_KEY);
    records.push(record);
    safeWrite(WORKFLOW_KEY, records);
    window.dispatchEvent(new CustomEvent("khaemenes:teacher-workflow-created", { detail: Object.freeze({ ...record }) }));
    return Object.freeze({ ...record });
  }

  function listTeacherWorkflows() {
    return safeRead(WORKFLOW_KEY).map(record => Object.freeze({ ...record }));
  }

  function adviseWorkflow(workflowId, kind = "evidence") {
    const records = safeRead(WORKFLOW_KEY);
    const index = records.findIndex(record => record.workflowId === workflowId);
    if (index < 0) return null;
    const record = records[index];
    const advice = guidance(kind, {
      stage: "teacher-review",
      subject: record?.noema?.subject,
      course: record?.noema?.course,
      assessmentId: record?.noema?.assessmentId,
      itemId: record?.noema?.itemId
    });
    records[index] = {
      ...record,
      stage: "archaemenes-advisory",
      archaemenes: {
        requestedAt: new Date().toISOString(),
        kind: advice.kind,
        guidance: advice.guidance,
        mentor: IDENTITY.name
      }
    };
    safeWrite(WORKFLOW_KEY, records);
    window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-workflow-advice", { detail: Object.freeze({ ...records[index] }) }));
    return Object.freeze({ ...records[index] });
  }

  function recordTeacherDecision(workflowId, decision = "reviewed", note = "") {
    const records = safeRead(WORKFLOW_KEY);
    const index = records.findIndex(record => record.workflowId === workflowId);
    if (index < 0) return false;
    records[index] = {
      ...records[index],
      stage: "course-or-academy-decision",
      teacher: {
        status: "reviewed",
        decision: clean(decision, 160),
        note: clean(note, 1200),
        reviewedAt: new Date().toISOString()
      }
    };
    const ok = safeWrite(WORKFLOW_KEY, records);
    if (ok) window.dispatchEvent(new CustomEvent("khaemenes:teacher-workflow-reviewed", { detail: Object.freeze({ ...records[index] }) }));
    return ok;
  }

  function status() {
    const workflows = listTeacherWorkflows();
    return Object.freeze({
      version: VERSION,
      connected: true,
      mode: "academy-local-advisor",
      mentor: IDENTITY,
      reviews: summarizeReviews(),
      teacherWorkflows: Object.freeze({ total: workflows.length, pending: workflows.filter(w => w?.teacher?.status !== "reviewed").length }),
      pipeline: PIPELINE,
      protectedCoreImported: false,
      liveNoemaConnectionClaimed: false,
      liveNAIBServiceClaimed: false
    });
  }

  window.KhaemenesArchaemenesAdvisor = Object.freeze({
    version: VERSION,
    identity: IDENTITY,
    pipeline: PIPELINE,
    status,
    summarizeReviews,
    guidance,
    request,
    normalizeNoemaEnvelope,
    routeThroughNAIB,
    createTeacherWorkflow,
    listTeacherWorkflows,
    adviseWorkflow,
    recordTeacherDecision
  });

  window.addEventListener("khaemenes:noema-evidence-ready", event => {
    if (event?.detail) createTeacherWorkflow(event.detail);
  });

  window.dispatchEvent(new CustomEvent("khaemenes:archaemenes-advisor-ready", {
    detail: {
      version: VERSION,
      mentor: IDENTITY.name,
      mode: "academy-local-advisor",
      pipeline: [...PIPELINE]
    }
  }));
})();
