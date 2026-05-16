import {
  critiqueLabels,
  examples,
  phases,
  promptModes,
  rubric,
  sentenceStarters,
} from "./activityData.js";

const storageKey = "student-ai-literacy-audit";

const selectors = {
  body: document.body,
  phaseRail: document.querySelector("#phase-rail"),
  questionBank: document.querySelector("#question-bank"),
  promptModes: document.querySelector("#prompt-modes"),
  promptPreview: document.querySelector("#prompt-preview"),
  critiqueLabels: document.querySelector("#critique-labels"),
  rubricGrid: document.querySelector("#rubric-grid"),
  starterList: document.querySelector("#starter-list"),
  exportPreview: document.querySelector("#export-preview"),
  progressValue: document.querySelector("#progress-value"),
  progressFill: document.querySelector("#progress-fill"),
  progressMeter: document.querySelector(".progress-meter"),
  progressList: document.querySelector("#progress-list"),
  scoreValue: document.querySelector("#score-value"),
  scoreLabel: document.querySelector("#score-label"),
  themeToggle: document.querySelector("#theme-toggle"),
  copyPrompt: document.querySelector("#copy-prompt"),
  copyExport: document.querySelector("#copy-export"),
  resetWork: document.querySelector("#reset-work"),
  loadSampleA: document.querySelector("#load-sample-a"),
  loadSampleB: document.querySelector("#load-sample-b"),
};

const fieldIds = [
  "class-question",
  "class-context",
  "own-answer",
  "own-evidence",
  "own-uncertainty",
  "response-a",
  "response-b",
  "critique-notes",
  "final-answer",
  "accepted",
  "changed",
  "judgment",
];

const fields = Object.fromEntries(
  fieldIds.map((id) => [id, document.getElementById(id)]),
);

const saved = readDraft();
const state = {
  activePhase: saved.activePhase || "question",
  questionId: saved.questionId || examples[0].id,
  promptMode: saved.promptMode || promptModes[0].id,
  labels: new Set(saved.labels || []),
  theme: saved.theme || "clarity",
  scores: {
    specificity: 3,
    evidence: 3,
    complexity: 3,
    voice: 3,
    verification: 3,
    ...(saved.scores || {}),
  },
};

function readDraft() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveDraft() {
  const values = Object.fromEntries(
    Object.entries(fields).map(([id, field]) => [id, field.value]),
  );
  const draft = {
    ...values,
    activePhase: state.activePhase,
    questionId: state.questionId,
    promptMode: state.promptMode,
    labels: [...state.labels],
    scores: state.scores,
    theme: state.theme,
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // Draft saving is helpful, but the activity still works without storage.
  }
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getFieldValue(id) {
  return fields[id]?.value.trim() || "";
}

function setFieldValue(id, value) {
  if (fields[id]) {
    fields[id].value = value;
  }
}

function activeExample() {
  return examples.find((example) => example.id === state.questionId) || examples[0];
}

function activePromptMode() {
  return (
    promptModes.find((mode) => mode.id === state.promptMode) || promptModes[0]
  );
}

function renderQuestionBank() {
  selectors.questionBank.innerHTML = examples
    .map(
      (example) => `
        <button
          class="choice-pill"
          type="button"
          data-question-id="${example.id}"
          aria-pressed="${example.id === state.questionId}"
        >
          ${escapeText(example.label)}
        </button>
      `,
    )
    .join("");
}

function renderPhaseRail() {
  selectors.phaseRail.innerHTML = phases
    .map(
      (phase, index) => `
        <a
          class="phase-link"
          href="#${phase.id}"
          data-phase-link="${phase.id}"
          aria-current="${phase.id === state.activePhase ? "step" : "false"}"
        >
          <span>${index + 1}</span>
          <strong>${escapeText(phase.label)}</strong>
          <small>${escapeText(phase.title)}</small>
        </a>
      `,
    )
    .join("");
}

function renderPromptModes() {
  selectors.promptModes.innerHTML = promptModes
    .map(
      (mode) => `
        <button
          class="mode-button"
          type="button"
          role="tab"
          data-prompt-mode="${mode.id}"
          aria-selected="${mode.id === state.promptMode}"
        >
          <span>${escapeText(mode.label)}</span>
          <small>${escapeText(mode.title)}</small>
        </button>
      `,
    )
    .join("");
}

function renderPrompt() {
  const question = getFieldValue("class-question") || "[insert your question]";
  const context = getFieldValue("class-context") || "[insert class source or context]";
  selectors.promptPreview.textContent = activePromptMode()
    .template.replace("{question}", question)
    .replace("{context}", context);
}

function renderCritiqueLabels() {
  selectors.critiqueLabels.innerHTML = critiqueLabels
    .map(
      (label) => `
        <button
          class="label-button"
          type="button"
          data-critique-label="${label.id}"
          aria-pressed="${state.labels.has(label.id)}"
        >
          <strong>${escapeText(label.label)}</strong>
          <span>${escapeText(label.helper)}</span>
        </button>
      `,
    )
    .join("");
}

function renderRubric() {
  selectors.rubricGrid.innerHTML = rubric
    .map(
      (item) => `
        <article class="rubric-row">
          <div>
            <h4>${escapeText(item.label)}</h4>
            <p>${escapeText(item.low)} to ${escapeText(item.high)}</p>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value="${state.scores[item.id]}"
            data-score="${item.id}"
            aria-label="${escapeText(item.label)} rating"
          />
          <output>${state.scores[item.id]}</output>
        </article>
      `,
    )
    .join("");
  renderScore();
}

function renderStarters() {
  selectors.starterList.innerHTML = sentenceStarters
    .map(
      (starter) => `
        <button class="starter-button" type="button" data-starter="${escapeText(starter)}">
          ${escapeText(starter)}
        </button>
      `,
    )
    .join("");
}

function renderScore() {
  const values = Object.values(state.scores);
  const average = values.reduce((sum, value) => sum + Number(value), 0) / values.length;
  selectors.scoreValue.textContent = average.toFixed(1);

  if (average >= 4.2) {
    selectors.scoreLabel.textContent = "Strong audit";
  } else if (average >= 3.2) {
    selectors.scoreLabel.textContent = "Developing judgment";
  } else {
    selectors.scoreLabel.textContent = "Needs more checking";
  }
}

function progressItems() {
  return [
    {
      label: "Question",
      done: getFieldValue("class-question").length > 12,
    },
    {
      label: "Own answer",
      done:
        getFieldValue("own-answer").length > 20 &&
        getFieldValue("own-evidence").length > 10 &&
        getFieldValue("own-uncertainty").length > 3,
    },
    {
      label: "Prompt",
      done: Boolean(state.promptMode && getFieldValue("class-question")),
    },
    {
      label: "AI responses",
      done:
        getFieldValue("response-a").length > 40 &&
        getFieldValue("response-b").length > 40,
    },
    {
      label: "Critique",
      done: state.labels.size > 0 && getFieldValue("critique-notes").length > 20,
    },
    {
      label: "Comparison",
      done: Object.values(state.scores).some((value) => Number(value) !== 3),
    },
    {
      label: "Reflection",
      done:
        getFieldValue("final-answer").length > 40 &&
        getFieldValue("accepted").length > 3 &&
        getFieldValue("changed").length > 3 &&
        getFieldValue("judgment").length > 3,
    },
  ];
}

function renderProgress() {
  const items = progressItems();
  const complete = items.filter((item) => item.done).length;
  const percent = Math.round((complete / items.length) * 100);

  selectors.progressValue.textContent = `${percent}%`;
  selectors.progressFill.style.width = `${percent}%`;
  selectors.progressMeter.setAttribute("aria-valuenow", String(percent));
  selectors.progressList.innerHTML = items
    .map(
      (item) => `
        <li data-complete="${item.done}">
          <span aria-hidden="true"></span>
          ${escapeText(item.label)}
        </li>
      `,
    )
    .join("");
}

function buildExportText() {
  const selectedLabels = [...state.labels]
    .map((id) => critiqueLabels.find((label) => label.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  return `AI Use Note

Question:
${getFieldValue("class-question") || "[question not entered]"}

I used AI to:
Compare an initial response with AI-generated ideas, critique the output, and revise my answer.

Labels I applied:
${selectedLabels || "[no labels selected yet]"}

I accepted:
${getFieldValue("accepted") || "[not entered yet]"}

I rejected or changed:
${getFieldValue("changed") || "[not entered yet]"}

My final judgment is:
${getFieldValue("judgment") || "[not entered yet]"}

Final answer:
${getFieldValue("final-answer") || "[not entered yet]"}`;
}

function renderExport() {
  selectors.exportPreview.textContent = buildExportText();
}

function hydrateFields() {
  const draft = readDraft();
  for (const id of fieldIds) {
    if (draft[id]) {
      setFieldValue(id, draft[id]);
    }
  }

  if (!getFieldValue("class-question")) {
    const example = activeExample();
    setFieldValue("class-question", example.question);
    setFieldValue("class-context", example.context);
  }
}

function selectExample(id) {
  const example = examples.find((candidate) => candidate.id === id);
  if (!example) {
    return;
  }

  state.questionId = id;
  setFieldValue("class-question", example.question);
  setFieldValue("class-context", example.context);
  renderQuestionBank();
  renderPrompt();
  renderExport();
  renderProgress();
  saveDraft();
}

function toggleCritiqueLabel(id) {
  const label = critiqueLabels.find((candidate) => candidate.id === id);
  if (!label) {
    return;
  }

  if (state.labels.has(id)) {
    state.labels.delete(id);
  } else {
    state.labels.add(id);
    const notes = getFieldValue("critique-notes");
    const addition = `${label.label}: `;
    if (!notes.includes(addition)) {
      setFieldValue(
        "critique-notes",
        `${notes}${notes ? "\n" : ""}${addition}`,
      );
    }
  }

  renderCritiqueLabels();
  renderProgress();
  renderExport();
  saveDraft();
}

async function copyText(text, button, readyLabel) {
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy failed";
  }

  window.setTimeout(() => {
    button.textContent = readyLabel || original;
  }, 1400);
}

function appendStarter(starter) {
  const current = getFieldValue("final-answer");
  const next = `${current}${current ? "\n" : ""}${starter} `;
  setFieldValue("final-answer", next);
  fields["final-answer"].focus();
  renderProgress();
  renderExport();
  saveDraft();
}

function loadSample(which) {
  const sample = which === "a" ? activeExample().sampleA : activeExample().sampleB;
  setFieldValue(which === "a" ? "response-a" : "response-b", sample);
  renderProgress();
  renderExport();
  saveDraft();
}

function setTheme(theme) {
  state.theme = theme === "contrast" ? "contrast" : "clarity";
  selectors.body.dataset.theme = state.theme;
  selectors.themeToggle.textContent =
    state.theme === "contrast" ? "Clarity" : "Contrast";
  saveDraft();
}

function toggleTheme() {
  setTheme(state.theme === "contrast" ? "clarity" : "contrast");
}

function resetWork() {
  const confirmed = window.confirm("Clear this activity draft?");
  if (!confirmed) {
    return;
  }

  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Nothing to clear.
  }

  state.questionId = examples[0].id;
  state.promptMode = promptModes[0].id;
  state.labels = new Set();
  state.scores = {
    specificity: 3,
    evidence: 3,
    complexity: 3,
    voice: 3,
    verification: 3,
  };

  for (const id of fieldIds) {
    setFieldValue(id, "");
  }

  hydrateFields();
  renderAll();
}

function bindEvents() {
  selectors.questionBank.addEventListener("click", (event) => {
    const button = event.target.closest("[data-question-id]");
    if (button) {
      selectExample(button.dataset.questionId);
    }
  });

  selectors.promptModes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prompt-mode]");
    if (!button) {
      return;
    }
    state.promptMode = button.dataset.promptMode;
    renderPromptModes();
    renderPrompt();
    renderProgress();
    saveDraft();
  });

  selectors.critiqueLabels.addEventListener("click", (event) => {
    const button = event.target.closest("[data-critique-label]");
    if (button) {
      toggleCritiqueLabel(button.dataset.critiqueLabel);
    }
  });

  selectors.rubricGrid.addEventListener("input", (event) => {
    const slider = event.target.closest("[data-score]");
    if (!slider) {
      return;
    }
    state.scores[slider.dataset.score] = Number(slider.value);
    slider.nextElementSibling.textContent = slider.value;
    renderScore();
    renderProgress();
    saveDraft();
  });

  selectors.starterList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-starter]");
    if (button) {
      appendStarter(button.dataset.starter);
    }
  });

  for (const field of Object.values(fields)) {
    field.addEventListener("input", () => {
      if (field.id === "class-question") {
        state.questionId = "custom";
        renderQuestionBank();
      }
      renderPrompt();
      renderProgress();
      renderExport();
      saveDraft();
    });
  }

  selectors.copyPrompt.addEventListener("click", () => {
    copyText(selectors.promptPreview.textContent, selectors.copyPrompt, "Copy Prompt");
  });

  selectors.copyExport.addEventListener("click", () => {
    copyText(buildExportText(), selectors.copyExport, "Copy Note");
  });

  selectors.loadSampleA.addEventListener("click", () => loadSample("a"));
  selectors.loadSampleB.addEventListener("click", () => loadSample("b"));
  selectors.themeToggle.addEventListener("click", toggleTheme);
  selectors.resetWork.addEventListener("click", resetWork);

  document.querySelectorAll("[data-phase]").forEach((section) => {
    observer.observe(section);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) {
      return;
    }
    state.activePhase = visible.target.dataset.phase;
    renderPhaseRail();
    saveDraft();
  },
  { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
);

function renderAll() {
  renderQuestionBank();
  renderPhaseRail();
  renderPromptModes();
  renderPrompt();
  renderCritiqueLabels();
  renderRubric();
  renderStarters();
  renderProgress();
  renderExport();
}

hydrateFields();
setTheme(state.theme);
renderAll();
bindEvents();
