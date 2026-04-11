/**
 * main.js — Shared logic that runs on every page.
 * Handles: nav scroll effect, theme toggle, mobile menu,
 *          back-to-top button, scroll-reveal animations.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initScrollReveal();
  initBackToTop();
  injectFooter();
  initPageTransitions();
  initCursorGlow();
  initClickBurst();
});

/* ── Theme (dark / light) ────────────────────────────────── */
function initTheme() {
  const root   = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  // Read saved preference; default to light mode
  const saved = localStorage.getItem("theme");
  const preferred = saved || "light";
  applyTheme(preferred);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("theme", next);
      // Show loader in the new theme's style
      if (typeof window.triggerLoader === "function") window.triggerLoader();
    });
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const icon = document.getElementById("theme-icon");
  if (icon) icon.innerHTML = theme === "dark" ? ICONS.sun : ICONS.moon;
}

/* ── Navigation ──────────────────────────────────────────── */
function initNav() {
  const nav       = document.querySelector(".nav");
  const hamburger = document.getElementById("nav-hamburger");
  const mobileMenu = document.getElementById("nav-mobile");

  // Set logo to first two initials ("AK")
  const logo = document.getElementById("nav-logo");
  if (logo && typeof CONTENT !== "undefined") {
    logo.textContent = CONTENT.name.split(" ").slice(0, 2).map(w => w[0]).join("") + ".";
  }

  // Initials click → clear session so loader plays on next index.html load
  if (logo) {
    logo.addEventListener("click", () => {
      sessionStorage.removeItem("portfolioLoaded");
    });
  }

  // Scroll shadow
  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  // Mobile menu toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    // Close on link click
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // Mark active link
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* ── Scroll-reveal ───────────────────────────────────────── */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings by 80ms
          const siblings = entry.target.closest("[data-reveal-group]");
          const delay = siblings
            ? Array.from(siblings.querySelectorAll(".reveal")).indexOf(entry.target) * 80
            : 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* ── Back to top ─────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ── Footer injection ────────────────────────────────────── */
function injectFooter() {
  const el = document.getElementById("footer-placeholder");
  if (!el || typeof CONTENT === "undefined") return;

  const year = new Date().getFullYear();
  el.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__inner">
          <p class="footer__copy">&copy; ${year} ${CONTENT.name}. All rights reserved.</p>
          <nav class="footer__links" aria-label="Footer navigation">
            <a href="mailto:${CONTENT.contact.email}">Email</a>
            <a href="${CONTENT.contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
            <a href="${CONTENT.contact.github}" target="_blank" rel="noopener">GitHub</a>
          </nav>
        </div>
      </div>
    </footer>
  `;
}

/* ── Page transitions ────────────────────────────────────── */
function initPageTransitions() {
  document.addEventListener("click", e => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");

    // Skip: external, hash-only, mailto/tel, new-tab, modifier keys
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("//") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      link.target === "_blank" ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    e.preventDefault();
    document.body.classList.add("is-leaving");
    setTimeout(() => { window.location.href = href; }, 200);
  });
}

/* ── Click burst ─────────────────────────────────────────── */
function initClickBurst() {
  document.addEventListener("click", (e) => {
    if (e.target.closest("a, button, input, select, textarea, label, [role='button']")) return;

    const burst = document.createElement("div");
    burst.className = "click-burst";
    burst.style.left = e.clientX + "px";
    burst.style.top  = e.clientY + "px";
    document.body.appendChild(burst);
    burst.addEventListener("animationend", () => burst.remove());
  });
}

/* ── Cursor glow ─────────────────────────────────────────── */
function initCursorGlow() {
  // Skip on touch-only devices
  if (window.matchMedia("(hover: none)").matches) return;

  const glow = document.createElement("div");
  glow.id = "cursor-glow";
  document.documentElement.appendChild(glow);

  let mouseX = -1000, mouseY = -1000;
  let glowX  = -1000, glowY  = -1000;
  let raf;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp so the glow drifts behind the cursor slightly
  function animate() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    raf = requestAnimationFrame(animate);
  }
  animate();
}

/* ── SVG icon library ────────────────────────────────────── */
const ICONS = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
         <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
         <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
         <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
         <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
         <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,

  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,

  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/></svg>`,

  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,

  github: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35
            6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65
            16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5
            4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9
            18.13V22"/></svg>`,

  copy: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,

  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
           <polyline points="20 6 9 17 4 12"/></svg>`,

  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,

  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,

  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <polyline points="6 9 12 15 18 9"/></svg>`,

  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};
