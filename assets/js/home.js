/**
 * home.js — Renders the home page dynamically from CONTENT and PROJECTS.
 * Requires: content.js, projects.js, main.js loaded before this.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderHero();
  renderSkills();
  renderFeaturedProjects();
  initCopyEmail();
});

/* ── Hero ─────────────────────────────────────────────────── */
function renderHero() {
  const c = CONTENT;

  // Photo
  const photo = document.getElementById("hero-photo");
  if (photo) { photo.src = c.photo; photo.alt = c.name; }

  // Text
  initEyebrowRotator();
  setText("hero-name",    c.name);
  setText("hero-tagline", c.tagline);

  // Social buttons
  const socialRow = document.getElementById("hero-social");
  if (socialRow) {
    socialRow.innerHTML = `
      <a href="${c.contact.linkedin}" target="_blank" rel="noopener" class="hero__social-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
          <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
        </svg>
        LinkedIn
      </a>
      <a href="${c.contact.github}" target="_blank" rel="noopener" class="hero__social-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
        GitHub
      </a>
      <a href="mailto:${c.contact.email}" class="hero__social-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,12 2,6"/>
        </svg>
        Email
      </a>
    `;
  }

  // QR code
  const qr = document.getElementById("hero-qr");
  if (qr && c.contact.qrCode) {
    qr.innerHTML = `
      <div class="qr-block">
        <img src="${c.contact.qrCode}" alt="LinkedIn QR code" loading="lazy">
        <span class="qr-block__label">LinkedIn QR</span>
      </div>
    `;
  }
}

/* ── Skills ──────────────────────────────────────────────── */
function renderSkills() {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  grid.innerHTML = CONTENT.skills.map(skill => `
    <div class="skill-chip reveal">
      <img src="${skill.icon}" alt="${skill.name}" loading="lazy">
      <span class="skill-chip__name">${skill.name}</span>
    </div>
  `).join("");

  // Re-trigger scroll-reveal for newly injected elements
  refreshReveal();
}

/* ── Featured projects ───────────────────────────────────── */
function renderFeaturedProjects() {
  const grid = document.getElementById("featured-projects-grid");
  if (!grid) return;

  const featured = PROJECTS.filter(p => p.featured).slice(0, 3);

  grid.innerHTML = featured.map(p => `
    <a href="projects/${p.id}.html" class="project-card reveal" style="text-decoration:none">
      <img class="project-card__image"
           src="${p.image}"
           alt="${p.title}"
           loading="lazy"
           onerror="this.style.display='none'">
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
          View project ${ICONS.arrowRight}
        </span>
      </div>
    </a>
  `).join("");

  refreshReveal();
}

/* ── Copy email ──────────────────────────────────────────── */
function initCopyEmail() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#copy-email-btn");
    if (!btn) return;
    e.preventDefault();

    try {
      await navigator.clipboard.writeText(CONTENT.contact.email);
      btn.classList.add("copied");
      const icon = document.getElementById("copy-icon");
      if (icon) icon.innerHTML = ICONS.check;

      setTimeout(() => {
        btn.classList.remove("copied");
        if (icon) icon.innerHTML = ICONS.copy;
      }, 2000);
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:${CONTENT.contact.email}`;
    }
  });
}

/* ── Eyebrow rotator ─────────────────────────────────────── */
function initEyebrowRotator() {
  const el = document.getElementById("hero-eyebrow");
  if (!el) return;

  const texts = [
    "Machine Learning",
    "Image / Signal Processing",
    "Computer Vision",
    "Software Engineer"
  ];
  let current = 0;

  el.innerHTML = `<span class="hero__eyebrow-text">${texts[0]}</span>`;
  const span = el.querySelector(".hero__eyebrow-text");

  function showNext() {
    span.classList.add("eyebrow--exit");
    span.addEventListener("animationend", () => {
      span.classList.remove("eyebrow--exit");
      current = (current + 1) % texts.length;
      span.textContent = texts[current];
      span.classList.add("eyebrow--enter");
      span.addEventListener("animationend", () => {
        span.classList.remove("eyebrow--enter");
        setTimeout(showNext, 1500);
      }, { once: true });
    }, { once: true });
  }

  span.classList.add("eyebrow--enter");
  span.addEventListener("animationend", () => {
    span.classList.remove("eyebrow--enter");
    setTimeout(showNext, 1500);
  }, { once: true });
}

/* ── Helpers ─────────────────────────────────────────────── */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function refreshReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal:not(.visible)").forEach(el => observer.observe(el));
}
