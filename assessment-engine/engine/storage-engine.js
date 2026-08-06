const PREFIX = "khaemenes.assessment";
const INDEX_KEY = `${PREFIX}.attempt-index.v1`;

function safeParse(raw, fallback = null) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Khaemenes storage parse failure", error);
    return fallback;
  }
}

function getStorage() {
  try {
    const probe = `${PREFIX}.probe`;
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch (error) {
    console.warn("Local storage is unavailable; using in-memory storage.", error);
    const memory = new Map();
    return {
      getItem: key => memory.has(key) ? memory.get(key) : null,
      setItem: (key, value) => memory.set(key, String(value)),
      removeItem: key => memory.delete(key)
    };
  }
}

export class AssessmentStorage {
  constructor(storage = getStorage()) {
    this.storage = storage;
  }

  keyForAttempt(attemptId) {
    return `${PREFIX}.attempt.${attemptId}`;
  }

  currentKey(assessmentId) {
    return `${PREFIX}.current.${assessmentId}`;
  }

  readIndex() {
    return safeParse(this.storage.getItem(INDEX_KEY), []);
  }

  writeIndex(index) {
    this.storage.setItem(INDEX_KEY, JSON.stringify(index));
  }

  saveAttempt(attempt) {
    if (!attempt?.id || !attempt?.assessmentId) {
      throw new Error("Attempt requires id and assessmentId.");
    }

    const now = new Date().toISOString();
    const saved = {
      ...attempt,
      updatedAt: now,
      schemaVersion: attempt.schemaVersion || "1.0.0"
    };

    this.storage.setItem(this.keyForAttempt(saved.id), JSON.stringify(saved));
    this.storage.setItem(this.currentKey(saved.assessmentId), saved.id);

    const index = this.readIndex().filter(entry => entry.id !== saved.id);
    index.unshift({
      id: saved.id,
      assessmentId: saved.assessmentId,
      status: saved.status,
      updatedAt: saved.updatedAt
    });
    this.writeIndex(index.slice(0, 100));

    return saved;
  }

  loadAttempt(attemptId) {
    return safeParse(this.storage.getItem(this.keyForAttempt(attemptId)));
  }

  loadCurrentAttempt(assessmentId) {
    const attemptId = this.storage.getItem(this.currentKey(assessmentId));
    return attemptId ? this.loadAttempt(attemptId) : null;
  }

  clearCurrentAttempt(assessmentId) {
    const attemptId = this.storage.getItem(this.currentKey(assessmentId));
    if (attemptId) this.storage.removeItem(this.keyForAttempt(attemptId));
    this.storage.removeItem(this.currentKey(assessmentId));
    this.writeIndex(this.readIndex().filter(entry => entry.id !== attemptId));
  }

  listAttempts(assessmentId = null) {
    const index = this.readIndex();
    return assessmentId
      ? index.filter(entry => entry.assessmentId === assessmentId)
      : index;
  }

  exportAttempt(attempt) {
    const blob = new Blob([JSON.stringify(attempt, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${attempt.assessmentId}-${attempt.id}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}

export function createAttemptId(assessmentId) {
  const random = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${assessmentId}-${random}`;
}
