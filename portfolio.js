import { capabilities, playbook, profile, tools } from "./portfolioData.js?v=28";

const state = {
  filter: "All",
  query: "",
  toolId: tools[0].id,
  playbookId: playbook[0].id,
  theme: readStoredTheme(),
};

const selectors = {
  filters: document.querySelector("#filters"),
  toolList: document.querySelector("#tool-list"),
  toolSearch: document.querySelector("#tool-search"),
  resultCount: document.querySelector("#result-count"),
  spotlightImage: document.querySelector("#spotlight-image"),
  spotlightCategory: document.querySelector("#spotlight-category"),
  spotlightTitle: document.querySelector("#spotlight-title"),
  spotlightSummary: document.querySelector("#spotlight-summary"),
  spotlightTags: document.querySelector("#spotlight-tags"),
  spotlightImpact: document.querySelector("#spotlight-impact"),
  spotlightSteps: document.querySelector("#spotlight-steps"),
  spotlightLink: document.querySelector("#spotlight-link"),
  copyTool: document.querySelector("#copy-tool"),
  profileStats: document.querySelector("#profile-stats"),
  capabilities: document.querySelector("#capabilities"),
  playbookTabs: document.querySelector("#playbook-tabs"),
  playbookPanel: document.querySelector("#playbook-panel"),
  profileLinks: document.querySelector("#profile-links"),
  themeToggle: document.querySelector("#theme-toggle"),
};

function readStoredTheme() {
  try {
    return localStorage.getItem("akesha-portfolio-theme") || "studio";
  } catch {
    return "studio";
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem("akesha-portfolio-theme", theme);
  } catch {
    // Storage can be unavailable on restricted file origins.
  }
}

function setText(selector, text) {
  for (const element of document.querySelectorAll(selector)) {
    element.textContent = text;
  }
}

function escapeText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function sourceName(url) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host === "akesha.github.io") {
    return "GitHub Pages";
  }
  if (host === "pages.github.iu.edu") {
    return "IU GitHub";
  }
  if (host === "huggingface.co") {
    return "Hugging Face";
  }
  if (host === "playlab.ai") {
    return "Playlab";
  }
  if (host === "instructional-reflection.vercel.app") {
    return "Vercel";
  }
  if (host === "ai-build-lab-1.onrender.com") {
    return "Render";
  }
  return host;
}

function renderProfile() {
  document.title = `${profile.name} | Interactive Tools Portfolio`;
  setText('[data-profile="name"]', profile.name);
  setText('[data-profile="initials"]', profile.initials);
  setText('[data-profile="eyebrow"]', profile.eyebrow);
  setText('[data-profile="headline"]', profile.headline);
  setText('[data-profile="role"]', profile.role);
  setText('[data-profile="bio"]', profile.bio);
  setText('[data-profile="focus"]', profile.focus);

  selectors.profileStats.innerHTML = profile.stats
    .map(
      (item) => `
        <div>
          <dt>${escapeText(item.label)}</dt>
          <dd>${escapeText(item.value)}</dd>
        </div>
      `,
    )
    .join("");

  selectors.profileLinks.innerHTML = profile.links
    .map(
      (link) => `
        <a class="link-card" href="${link.url}" target="_blank" rel="noopener noreferrer">
          <span>${escapeText(link.label)}</span>
          <strong>${escapeText(link.text)}</strong>
        </a>
      `,
    )
    .join("");
}

function renderFilters() {
  const filters = ["All", ...new Set(tools.map((tool) => tool.category))];
  selectors.filters.innerHTML = filters
    .map(
      (filter) => `
        <button
          class="filter-button"
          type="button"
          data-filter="${escapeText(filter)}"
          aria-pressed="${filter === state.filter}"
        >
          ${escapeText(filter)}
        </button>
      `,
    )
    .join("");
}

function visibleTools() {
  const query = state.query.trim().toLowerCase();
  return tools.filter((tool) => {
    const matchesFilter = state.filter === "All" || tool.category === state.filter;
    const searchable = [
      tool.title,
      tool.category,
      tool.summary,
      tool.audience,
      tool.format,
      ...tool.tags,
    ]
      .join(" ")
      .toLowerCase();
    return matchesFilter && (!query || searchable.includes(query));
  });
}

function renderTools() {
  const visible = visibleTools();

  if (!visible.some((tool) => tool.id === state.toolId)) {
    state.toolId = visible[0]?.id || tools[0].id;
  }

  selectors.resultCount.textContent = `${visible.length} of ${tools.length} tools`;

  if (visible.length === 0) {
    selectors.toolList.innerHTML = `
      <div class="empty-state">
        <h3>No tools found</h3>
        <p>Try a broader search or switch the category filter.</p>
      </div>
    `;
    return;
  }

  selectors.toolList.innerHTML = visible
    .map(
      (tool) => `
        <button
          class="project-card"
          type="button"
          data-tool-id="${tool.id}"
          aria-pressed="${tool.id === state.toolId}"
          aria-label="${tool.id === state.toolId ? "Showing" : "View"} details for ${escapeText(tool.title)}"
        >
          <img src="${tool.image}" alt="" width="224" height="156" loading="lazy" />
          <span>
            <span class="project-meta">${escapeText(tool.category)}</span>
            <h3>${escapeText(tool.title)}</h3>
            <p>${escapeText(tool.summary)}</p>
            <span class="project-action">
              ${tool.id === state.toolId ? "Showing details" : "View details"}
              <span aria-hidden="true">&rarr;</span>
            </span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderSpotlight() {
  const tool = tools.find((candidate) => candidate.id === state.toolId) || tools[0];

  selectors.spotlightImage.src = tool.image;
  selectors.spotlightImage.alt = `${tool.title} preview`;
  selectors.spotlightCategory.textContent = tool.category;
  selectors.spotlightTitle.textContent = tool.title;
  selectors.spotlightSummary.textContent = tool.summary;
  selectors.spotlightLink.href = tool.url;
  selectors.spotlightTags.innerHTML = tool.tags
    .map((tag) => `<span class="tag">${escapeText(tag)}</span>`)
    .join("");

  const impact = [
    { label: "Audience", value: tool.audience },
    { label: "Format", value: tool.format },
    { label: "Source", value: sourceName(tool.url) },
  ];

  selectors.spotlightImpact.innerHTML = impact
    .map(
      (item) => `
        <div>
          <dt>${escapeText(item.label)}</dt>
          <dd>${escapeText(item.value)}</dd>
        </div>
      `,
    )
    .join("");

  const steps = [
    {
      title: "Why it belongs here",
      text: tool.summary,
    },
    {
      title: "Who it serves",
      text: `${tool.audience} using a ${tool.format.toLowerCase()} format.`,
    },
    {
      title: "How to explore it",
      text: `Open the standalone tool on ${sourceName(tool.url)}.`,
    },
  ];

  selectors.spotlightSteps.innerHTML = steps
    .map(
      (step, index) => `
        <article class="timeline-item">
          <span class="timeline-index">${index + 1}</span>
          <div>
            <h4>${escapeText(step.title)}</h4>
            <p>${escapeText(step.text)}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderCapabilities() {
  selectors.capabilities.innerHTML = capabilities
    .map(
      (capability, index) => `
        <article class="capability">
          <span class="capability-number">${String(index + 1).padStart(2, "0")}</span>
          <h3>${escapeText(capability.title)}</h3>
          <p>${escapeText(capability.text)}</p>
        </article>
      `,
    )
    .join("");
}

function renderPlaybook() {
  selectors.playbookTabs.innerHTML = playbook
    .map(
      (mode) => `
        <button
          class="playbook-tab"
          type="button"
          role="tab"
          data-playbook-id="${mode.id}"
          aria-selected="${mode.id === state.playbookId}"
        >
          ${escapeText(mode.label)}
        </button>
      `,
    )
    .join("");

  const active = playbook.find((mode) => mode.id === state.playbookId) || playbook[0];
  selectors.playbookPanel.innerHTML = `
    <article>
      <h3>${escapeText(active.title)}</h3>
      <p>${escapeText(active.text)}</p>
      <ul class="playbook-points">
        ${active.points.map((point) => `<li>${escapeText(point)}</li>`).join("")}
      </ul>
    </article>
  `;
}

function applyTheme(theme) {
  const themes = ["studio", "night", "focus"];
  const nextTheme = themes.includes(theme) ? theme : "studio";
  document.body.dataset.theme = nextTheme;
  state.theme = nextTheme;
  selectors.themeToggle.title = `Theme: ${nextTheme}`;
  storeTheme(nextTheme);
}

function cycleTheme() {
  const themes = ["studio", "night", "focus"];
  const currentIndex = themes.indexOf(state.theme);
  applyTheme(themes[(currentIndex + 1) % themes.length]);
}

function bindEvents() {
  selectors.filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) {
      return;
    }

    state.filter = button.dataset.filter;
    renderFilters();
    renderTools();
    renderSpotlight();
  });

  selectors.toolSearch.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderTools();
    renderSpotlight();
  });

  selectors.toolList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool-id]");
    if (!button) {
      return;
    }

    state.toolId = button.dataset.toolId;
    renderTools();
    renderSpotlight();
  });

  selectors.playbookTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-playbook-id]");
    if (!button) {
      return;
    }

    state.playbookId = button.dataset.playbookId;
    renderPlaybook();
  });

  selectors.themeToggle.addEventListener("click", cycleTheme);
  selectors.copyTool.addEventListener("click", copyCurrentToolUrl);
  bindStageTilt();
}

async function copyCurrentToolUrl() {
  const tool = tools.find((candidate) => candidate.id === state.toolId) || tools[0];
  try {
    await navigator.clipboard.writeText(tool.url);
    selectors.copyTool.textContent = "Copied";
  } catch {
    selectors.copyTool.textContent = "Copy failed";
  }

  window.setTimeout(() => {
    selectors.copyTool.textContent = "Copy Link";
  }, 1600);
}

function bindStageTilt() {
  const stage = document.querySelector("[data-tilt]");
  if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.setProperty("--tilt-x", `${x * 8}deg`);
    stage.style.setProperty("--tilt-y", `${y * -8}deg`);
  });

  stage.addEventListener("pointerleave", () => {
    stage.style.setProperty("--tilt-x", "0deg");
    stage.style.setProperty("--tilt-y", "0deg");
  });
}

renderProfile();
renderFilters();
renderTools();
renderSpotlight();
renderCapabilities();
renderPlaybook();
applyTheme(state.theme);
bindEvents();
