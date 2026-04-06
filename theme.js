'use strict';

(function () {
  const STORAGE_KEY = 'javafacil_theme';

  function applyTheme(theme) {
    const html = document.documentElement;
    if (theme === 'default') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);

    // Update active state in panel
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === theme);
    });
  }

  function initTheme() {
    // Apply saved theme immediately (before paint)
    const saved = localStorage.getItem(STORAGE_KEY) || 'default';
    applyTheme(saved);

    const btn   = document.getElementById('btn-theme');
    const panel = document.getElementById('theme-panel');
    if (!btn || !panel) return;

    // Toggle panel
    btn.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('open');
      }
    });

    // Theme options
    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.addEventListener('click', () => {
        applyTheme(opt.dataset.theme);
        panel.classList.remove('open');
      });
    });
  }

  // Run as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Also apply theme before first paint to avoid flash
  const earlyTheme = localStorage.getItem(STORAGE_KEY);
  if (earlyTheme && earlyTheme !== 'default') {
    document.documentElement.setAttribute('data-theme', earlyTheme);
  }
})();
