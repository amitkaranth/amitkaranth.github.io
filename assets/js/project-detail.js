/**
 * project-detail.js — Renders an individual project detail page.
 * The page reads the project ID from its own filename via the URL.
 * Requires: content.js, projects.js (data), main.js loaded before this.
 */

document.addEventListener("DOMContentLoaded", () => {
  const id      = getProjectIdFromURL();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) {
    document.title = "Project Not Found";
    document.getElementById("project-content").innerHTML = `
      <div class="container" style="padding:var(--space-16) 0;text-align:center">
        <p style="color:var(--color-text-muted)">Project not found.</p>
        <a href="../projects.html" class="btn btn--primary" style="margin-top:var(--space-4)">
          ${ICONS.arrowLeft} Back to Projects
        </a>
      </div>`;
    return;
  }

  renderProjectDetail(project);
  initTechToggle();
});

/* ── Determine project ID from page URL ──────────────────── */
function getProjectIdFromURL() {
  const filename = window.location.pathname.split("/").pop();  // e.g. "project-one.html"
  return filename.replace(".html", "");
}

/* ── Render ──────────────────────────────────────────────── */
function renderProjectDetail(p) {
  document.title = `${p.title} — Portfolio`;

  // Hero
  document.getElementById("project-tags").innerHTML =
    (p.nda ? `<span class="badge badge--nda">🔒 NDA Protected</span>` : "") +
    p.tags.map(t => `<span class="badge">${t}</span>`).join("");

  setText("project-title",   p.title);
  setText("project-tagline", p.hook);

  // Action links (suppress GitHub/Live for NDA projects)
  const linksEl = document.getElementById("project-links");
  if (linksEl) {
    linksEl.innerHTML = `
      <a href="../projects.html" class="btn btn--ghost">
        ${ICONS.arrowLeft} All Projects
      </a>
      ${(!p.nda && p.links.github) ? `
        <a href="${p.links.github}" target="_blank" rel="noopener" class="btn btn--outline">
          ${ICONS.github} View Code
        </a>` : ""}
      ${(!p.nda && p.links.live) ? `
        <a href="${p.links.live}" target="_blank" rel="noopener" class="btn btn--primary">
          ${ICONS.externalLink} Live Demo
        </a>` : ""}
    `;
  }

  // Hide the tech/non-tech toggle for NDA projects (both versions say the same thing)
  if (p.nda) {
    const toggleRow = document.querySelector(".tech-toggle");
    if (toggleRow) toggleRow.style.display = "none";
  }

  // Cover image
  const cover = document.getElementById("project-cover");
  if (cover) {
    cover.src = `../${p.image}`;
    cover.alt = p.title;
    cover.onerror = () => cover.style.display = "none";
  }

  // Descriptions
  const techEl    = document.getElementById("description-tech");
  const nonTechEl = document.getElementById("description-nontech");
  if (techEl)    techEl.innerHTML    = p.techDesc;
  if (nonTechEl) nonTechEl.innerHTML = p.nonTechDesc;

  // Sidebar tech stack
  const stackEl = document.getElementById("tech-stack-tags");
  if (stackEl) {
    stackEl.innerHTML = p.tags.map(t => `<span class="badge">${t}</span>`).join("");
  }
}

/* ── Tech / Non-tech segmented control ───────────────────── */
function initTechToggle() {
  const btnTech   = document.getElementById("btn-technical");
  const btnSimple = document.getElementById("btn-simple");
  const techEl    = document.getElementById("description-tech");
  const simpleEl  = document.getElementById("description-nontech");

  if (!btnTech || !btnSimple || !techEl || !simpleEl) return;

  function switchTo(showSimple) {
    const current = showSimple ? techEl   : simpleEl;
    const next    = showSimple ? simpleEl : techEl;

    // Fade out current
    current.style.opacity = "0";

    setTimeout(() => {
      current.style.display = "none";
      next.style.display    = "block";
      next.style.opacity    = "0";

      // Fade in next on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { next.style.opacity = "1"; });
      });

      // Update button states
      btnTech.classList.toggle("seg-control__btn--active",  !showSimple);
      btnSimple.classList.toggle("seg-control__btn--active", showSimple);
    }, 250);
  }

  btnTech.addEventListener("click",   () => switchTo(false));
  btnSimple.addEventListener("click", () => switchTo(true));
}

/* ── Helper ──────────────────────────────────────────────── */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
