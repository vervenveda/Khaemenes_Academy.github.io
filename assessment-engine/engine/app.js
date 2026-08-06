import { KhaemenesAssessmentEngine } from "./assessment-core.js";

const mount = document.getElementById("assessmentMount");
const launchButton = document.getElementById("launchDemo");
const exportButton = document.getElementById("exportAttempt");

let engine = null;

async function loadAssessment() {
  const response = await fetch("./banks/foundation/demo-readiness.json", {
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Assessment bank could not be loaded (${response.status}).`);
  }
  return response.json();
}

async function launch() {
  launchButton.disabled = true;
  launchButton.textContent = "Loading diagnostic…";

  try {
    const assessment = await loadAssessment();
    engine = new KhaemenesAssessmentEngine({
      assessment,
      mount,
      onStateChange: ({ attempt }) => {
        exportButton.disabled = !attempt;
      }
    });
    engine.start({ resume: true });
    mount.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);
    mount.innerHTML = `
      <div class="empty-state">
        <span class="empty-symbol" aria-hidden="true">!</span>
        <h3>The demonstration could not load.</h3>
        <p>
          GitHub Pages must serve the files over HTTP. Confirm that the complete
          assessment-engine folder was uploaded and that the JSON bank path is intact.
        </p>
      </div>
    `;
  } finally {
    launchButton.disabled = false;
    launchButton.textContent = "Launch foundation diagnostic";
  }
}

exportButton.addEventListener("click", () => {
  if (engine?.attempt) engine.storage.exportAttempt(engine.attempt);
});

launchButton.addEventListener("click", launch);
