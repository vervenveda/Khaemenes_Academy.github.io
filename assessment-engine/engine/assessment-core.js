import { AssessmentStorage, createAttemptId } from "./storage-engine.js";
import { scoreResponse, aggregateMastery, summarizeAttempt } from "./scoring-engine.js";
import { selectNextItem, countDomainEvidence } from "./adaptive-selector.js";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstDomain(item) {
  const domain = item.domains?.[0];
  return typeof domain === "string" ? domain : domain?.id || "general";
}

function titleCase(value = "") {
  return value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());
}

function answerIsPresent(item, value) {
  if (item.type === "multi-select") return Array.isArray(value) && value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export class KhaemenesAssessmentEngine {
  constructor({ assessment, mount, storage = new AssessmentStorage(), onStateChange = null }) {
    if (!assessment?.id || !Array.isArray(assessment.items)) {
      throw new Error("A valid assessment with an id and item array is required.");
    }
    if (!(mount instanceof HTMLElement)) {
      throw new Error("A valid mount element is required.");
    }

    this.assessment = assessment;
    this.mount = mount;
    this.storage = storage;
    this.onStateChange = onStateChange;
    this.currentItem = null;
    this.message = "";
    this.feedback = null;
    this.attempt = null;
  }

  start({ resume = true } = {}) {
    const current = resume
      ? this.storage.loadCurrentAttempt(this.assessment.id)
      : null;

    if (current && current.status !== "completed") {
      this.attempt = current;
    } else {
      this.attempt = {
        schemaVersion: "1.0.0",
        id: createAttemptId(this.assessment.id),
        assessmentId: this.assessment.id,
        assessmentVersion: this.assessment.version,
        learnerId: null,
        status: "in-progress",
        mode: this.assessment.mode || "diagnostic",
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        responses: {},
        evidence: [],
        sequence: [],
        currentItemId: null,
        learnerProfile: {
          mastery: {},
          activeMisconceptions: [],
          interests: [],
          targetDifficulty: 0.5,
          exposureCounts: {}
        },
        summary: null
      };
      this.save();
    }

    this.restoreOrSelectItem();
    this.render();
    this.emitState();
  }

  restoreOrSelectItem() {
    if (this.attempt.currentItemId) {
      const restored = this.assessment.items.find(item => item.id === this.attempt.currentItemId);
      if (restored && !(restored.id in this.attempt.responses)) {
        this.currentItem = restored;
        return;
      }
    }
    this.currentItem = this.selectNext();
    this.attempt.currentItemId = this.currentItem?.id || null;
    this.save();
  }

  selectNext() {
    const settings = this.assessment.settings || {};
    const mode = this.attempt.mode || this.assessment.mode || "diagnostic";

    if (settings.delivery === "fixed") {
      const answered = new Set(Object.keys(this.attempt.responses));
      return [...this.assessment.items]
        .sort((a, b) => Number(a.order ?? 9999) - Number(b.order ?? 9999))
        .find(item => !answered.has(item.id)) || null;
    }

    return selectNextItem({
      items: this.assessment.items,
      answeredIds: Object.keys(this.attempt.responses),
      mode,
      profile: this.attempt.learnerProfile,
      blueprint: this.assessment.blueprint,
      domainCounts: countDomainEvidence(this.attempt.evidence),
      policy: settings.adaptivePolicy
    });
  }

  save() {
    this.attempt = this.storage.saveAttempt(this.attempt);
  }

  emitState() {
    this.onStateChange?.({
      assessment: this.assessment,
      attempt: this.attempt,
      currentItem: this.currentItem
    });
  }

  collectResponse(form) {
    const item = this.currentItem;
    if (item.type === "multi-select") {
      return [...form.querySelectorAll('input[name="answer"]:checked')].map(input => input.value);
    }
    return form.elements.answer?.value;
  }

  submit(response) {
    const item = this.currentItem;
    if (!item || !answerIsPresent(item, response)) {
      this.message = "Please provide a response before continuing.";
      this.render();
      return;
    }

    const record = {
      ...scoreResponse(item, response),
      difficulty: Number(item.difficulty ?? 0.5),
      response
    };

    this.attempt.responses[item.id] = response;
    this.attempt.evidence = this.attempt.evidence.filter(entry => entry.itemId !== item.id);
    this.attempt.evidence.push(record);
    this.attempt.sequence.push(item.id);
    this.attempt.learnerProfile.exposureCounts[item.id] =
      Number(this.attempt.learnerProfile.exposureCounts[item.id] || 0) + 1;

    this.attempt.learnerProfile.mastery = aggregateMastery(this.attempt.evidence);
    this.attempt.learnerProfile.activeMisconceptions = [
      ...new Set(this.attempt.evidence.flatMap(entry => entry.misconceptions || []))
    ];

    if (item.type === "likert" && Array.isArray(item.interestTags) && Number(response) >= 4) {
      this.attempt.learnerProfile.interests = [
        ...new Set([...this.attempt.learnerProfile.interests, ...item.interestTags])
      ];
    }

    const settings = this.assessment.settings || {};
    const maxItems = Number(settings.maxItems || this.assessment.items.length);
    const minimumItems = Number(settings.minItems || maxItems);
    const answeredCount = Object.keys(this.attempt.responses).length;
    const noMoreItems = answeredCount >= maxItems;

    this.feedback = {
      status: record.status,
      title: record.manualReview
        ? "Response recorded for review"
        : record.nonGraded
          ? "Reflection recorded"
          : record.status === "correct"
            ? "Evidence recorded"
            : "Response recorded",
      text: item.feedback?.[record.status]
        || item.feedback?.general
        || (record.manualReview
          ? "A teacher or mentor can evaluate this evidence with the assigned rubric."
          : "Your response has been added to the mastery record.")
    };

    this.message = "";
    this.attempt.currentItemId = null;
    this.save();

    if (noMoreItems && answeredCount >= minimumItems) {
      this.finish();
      return;
    }

    this.currentItem = this.selectNext();
    if (!this.currentItem) {
      this.finish();
      return;
    }

    this.attempt.currentItemId = this.currentItem.id;
    this.save();
    this.render();
    this.emitState();
  }

  finish() {
    this.attempt.status = "completed";
    this.attempt.completedAt = new Date().toISOString();
    this.attempt.currentItemId = null;
    this.attempt.summary = summarizeAttempt(this.attempt, this.assessment);
    this.currentItem = null;
    this.save();
    this.render();
    this.emitState();
  }

  restart() {
    const approved = window.confirm("Start a new attempt? The current local attempt will be replaced.");
    if (!approved) return;
    this.storage.clearCurrentAttempt(this.assessment.id);
    this.feedback = null;
    this.start({ resume: false });
  }

  progress() {
    const answered = Object.keys(this.attempt.responses || {}).length;
    const total = Number(this.assessment.settings?.maxItems || this.assessment.items.length);
    return {
      answered,
      total,
      percent: Math.min(100, Math.round((answered / Math.max(total, 1)) * 100))
    };
  }

  renderInput(item) {
    const saved = this.attempt.responses[item.id];

    if (item.type === "single-choice" || item.type === "multi-select") {
      const inputType = item.type === "single-choice" ? "radio" : "checkbox";
      const savedValues = new Set(Array.isArray(saved) ? saved.map(String) : [String(saved ?? "")]);
      return `
        <div class="choice-list">
          ${(item.options || []).map(option => `
            <label class="choice">
              <input
                type="${inputType}"
                name="answer"
                value="${escapeHtml(option.value)}"
                ${savedValues.has(String(option.value)) ? "checked" : ""}
              >
              <span>${escapeHtml(option.label)}</span>
            </label>
          `).join("")}
        </div>
      `;
    }

    if (item.type === "likert") {
      const min = Number(item.scale?.min ?? 1);
      const max = Number(item.scale?.max ?? 5);
      const labels = item.scale?.labels || {};
      const values = Array.from({ length: max - min + 1 }, (_, index) => min + index);
      return `
        <div class="likert">
          ${values.map(value => `
            <label>
              <input type="radio" name="answer" value="${value}" ${String(saved) === String(value) ? "checked" : ""}>
              <span>${escapeHtml(labels[value] || String(value))}</span>
            </label>
          `).join("")}
        </div>
      `;
    }

    if (item.type === "short-response" || item.type === "extended-response") {
      return `
        <textarea class="answer-input" name="answer" aria-label="Written response">${escapeHtml(saved || "")}</textarea>
      `;
    }

    return `
      <input
        class="answer-input"
        type="${item.type === "numeric" ? "number" : "text"}"
        name="answer"
        value="${escapeHtml(saved || "")}"
        ${item.type === "numeric" ? 'inputmode="decimal" step="any"' : ""}
        aria-label="Assessment response"
      >
    `;
  }

  renderResults() {
    const summary = this.attempt.summary || summarizeAttempt(this.attempt, this.assessment);
    const masteryEntries = Object.entries(summary.mastery || {})
      .sort((a, b) => b[1].mastery - a[1].mastery);

    return `
      <div class="assessment-shell">
        <div class="assessment-topline">
          <div>
            <p class="eyebrow">Attempt completed</p>
            <h3>${escapeHtml(this.assessment.title)}</h3>
          </div>
          <div class="assessment-meta">
            ${escapeHtml(new Date(summary.completedAt).toLocaleString())}
          </div>
        </div>

        <div class="results-grid">
          <article class="result-card">
            <h4>Objective evidence</h4>
            <p>
              ${summary.objectivePercent == null
                ? "No auto-scored items were included."
                : `${summary.objectivePercent}% · ${summary.earned} of ${summary.possible} points`}
            </p>
          </article>
          <article class="result-card">
            <h4>Responses recorded</h4>
            <p>${summary.answered} responses · ${summary.manualReviewCount} awaiting human review</p>
          </article>
          <article class="result-card">
            <h4>Standards observed</h4>
            <p>${summary.standardsObserved.length
              ? summary.standardsObserved.map(escapeHtml).join(" · ")
              : "No formal standards were assigned to this demonstration."}</p>
          </article>
          <article class="result-card">
            <h4>Interpretation</h4>
            <p>
              This is a foundation diagnostic, not a permanent placement decision.
              Additional evidence should confirm each conclusion.
            </p>
          </article>
        </div>

        <div class="question-card" style="margin-top:18px">
          <span class="question-domain">Mastery evidence</span>
          <h4>Current domain signals</h4>
          ${masteryEntries.length ? masteryEntries.map(([id, data]) => `
            <div class="mastery-row">
              <div class="mastery-label">
                <span>${escapeHtml(titleCase(id))}</span>
                <span>${Math.round(data.mastery * 100)}% · confidence ${Math.round(data.confidence * 100)}%</span>
              </div>
              <div class="mastery-meter"><span style="width:${Math.round(data.mastery * 100)}%"></span></div>
            </div>
          `).join("") : "<p>No scored domain evidence is available.</p>"}
        </div>

        <div class="assessment-actions">
          <button class="button button-secondary" type="button" data-action="restart">New attempt</button>
          <button class="button button-primary" type="button" data-action="export">Export evidence JSON</button>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.attempt) return;

    if (this.attempt.status === "completed") {
      this.mount.innerHTML = this.renderResults();
      this.bindActions();
      return;
    }

    const item = this.currentItem;
    const progress = this.progress();

    if (!item) {
      this.finish();
      return;
    }

    this.mount.innerHTML = `
      <div class="assessment-shell">
        <div class="assessment-topline">
          <div>
            <p class="eyebrow">${escapeHtml(this.assessment.mode || "assessment")} mode</p>
            <h3>${escapeHtml(this.assessment.title)}</h3>
          </div>
          <div class="assessment-meta">
            ${progress.answered} of ${progress.total} responses · autosaved
          </div>
        </div>

        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress.percent}">
          <span style="width:${progress.percent}%"></span>
        </div>

        <form id="assessmentForm" novalidate>
          <article class="question-card">
            <span class="question-domain">${escapeHtml(titleCase(firstDomain(item)))}</span>
            <h4>${escapeHtml(item.prompt)}</h4>
            ${this.renderInput(item)}
          </article>

          ${this.feedback ? `
            <div class="feedback" data-kind="${this.feedback.status === "correct" ? "success" : "neutral"}">
              <strong>${escapeHtml(this.feedback.title)}</strong>
              <p>${escapeHtml(this.feedback.text)}</p>
            </div>
          ` : ""}

          <div class="assessment-message" role="alert">${escapeHtml(this.message)}</div>

          <div class="assessment-actions">
            <button class="button button-secondary" type="button" data-action="save">Save progress</button>
            <button class="button button-primary" type="submit">Record response and continue</button>
          </div>
        </form>
      </div>
    `;

    const form = this.mount.querySelector("#assessmentForm");
    form?.addEventListener("submit", event => {
      event.preventDefault();
      this.submit(this.collectResponse(form));
    });
    this.bindActions();
  }

  bindActions() {
    this.mount.querySelector('[data-action="save"]')?.addEventListener("click", () => {
      this.save();
      this.message = "Progress saved on this device.";
      this.render();
    });

    this.mount.querySelector('[data-action="restart"]')?.addEventListener("click", () => this.restart());
    this.mount.querySelector('[data-action="export"]')?.addEventListener("click", () => {
      this.storage.exportAttempt(this.attempt);
    });
  }
}
