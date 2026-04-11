/**
 * projects.js — Renders the projects listing page with filtering.
 * Requires: content.js, projects.js (data), main.js loaded before this.
 *
 * FILTER_CATEGORIES defines the fixed filter bar labels.
 * To add or rename a filter: edit this array AND update each project's
 * `categories` field in assets/data/projects.js accordingly.
 */

const FILTER_CATEGORIES = [
  "All",
  "Python",
  "Java",
  "C/C++",
  "MATLAB",
  "ML & AI",
  "Image & Signal Processing",
];

document.addEventListener("DOMContentLoaded", () => {
  renderFilterBar();
  renderProjects("All");
});

/* ── Filter bar ──────────────────────────────────────────── */
function renderFilterBar() {
  const bar = document.getElementById("filter-bar");
  if (!bar) return;

  bar.innerHTML = FILTER_CATEGORIES.map(cat => `
    <button class="filter-btn ${cat === "All" ? "active" : ""}"
            data-category="${cat}">
      ${cat}
    </button>
  `).join("");

  bar.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    bar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProjects(btn.dataset.category);
  });
}

/* ── Projects grid ───────────────────────────────────────── */
function renderProjects(activeCategory) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  const filtered = activeCategory === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.categories && p.categories.includes(activeCategory));

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1">
      No projects found for "${activeCategory}".
    </p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <a href="projects/${p.id}.html" class="project-card reveal" style="text-decoration:none">
      ${p.image ? `<img class="project-card__image"
           src="${p.image}"
           alt="${p.title}"
           loading="lazy"
           onerror="this.style.display='none'">` : ""}
      <div class="project-card__body">
        <div class="project-card__tags" style="margin-bottom:var(--space-2)">
          ${p.nda ? `<span class="badge badge--nda">🔒 NDA Protected</span>` : ""}
        </div>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__hook">${p.hook}</p>
        <div class="project-card__tags">
          ${p.tags.map(t => `<span class="badge">${t}</span>`).join("")}
        </div>
      </div>
      <div class="project-card__footer">
        <span style="font-size:var(--text-sm);color:var(--color-accent);font-weight:600;display:flex;align-items:center;gap:4px">
          Read more ${ICONS.arrowRight}
        </span>
      </div>
    </a>
  `).join("");

  // Animate in
  requestAnimationFrame(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    grid.querySelectorAll(".reveal").forEach(el => obs.observe(el));
  });
}
