/**
 * interests.js — Renders the Interests page from CONTENT.interests.
 * Requires: content.js, main.js loaded before this.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderVision();
  renderTechnicalInterests();
  renderPersonalInterests();
  renderSynthesis();
  initScrollReveal(); // re-run after dynamic .reveal elements are injected
});

function renderVision() {
  const el = document.getElementById("vision-statement");
  if (el) el.innerHTML = `<p class="vision-block__text">${CONTENT.interests.visionStatement.trim()}</p>`;
}

function renderTechnicalInterests() {
  const grid = document.getElementById("technical-interests-grid");
  if (!grid) return;

  grid.innerHTML = CONTENT.interests.technical.map(item => `
    <div class="interest-card reveal">
      <div class="interest-card__icon">${item.icon}</div>
      <h3 class="interest-card__title">${item.title}</h3>
      <p class="interest-card__body">${item.body}</p>
    </div>
  `).join("");
}

function renderPersonalInterests() {
  const list = document.getElementById("personal-interests-list");
  if (!list) return;

  list.innerHTML = CONTENT.interests.personal.map(item => `
    <p class="split-section__item reveal">${item.body}</p>
  `).join("");
}

function renderSynthesis() {
  const el = document.getElementById("synthesis-text");
  if (el) el.innerHTML = CONTENT.interests.synthesis.trim().split("\n\n")
    .map(p => `<p>${p.trim()}</p>`).join("");
}
