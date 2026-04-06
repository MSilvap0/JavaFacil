// ── Page Guard — redirect to login if not authenticated ───────────────────────
// Include this script AFTER Firebase SDKs and auth.js on protected pages
'use strict';

(function () {
  // Show loading overlay while checking auth
  const guard = document.createElement('div');
  guard.id = 'jf-page-guard';
  guard.style.cssText = `
    position:fixed;inset:0;
    background:var(--t-bg,#f0f4ff);
    display:flex;align-items:center;justify-content:center;
    z-index:99999;font-size:3rem;
    transition:opacity 0.3s;
  `;
  guard.textContent = '☕';
  document.body.appendChild(guard);

  function removeGuard() {
    guard.style.opacity = '0';
    setTimeout(() => guard.remove(), 350);
  }

  // Wait for Firebase auth to resolve
  JFAuth.onAuthChange((user) => {
    if (user) {
      removeGuard();
    } else {
      // Save current page to redirect back after login
      localStorage.setItem('jf_redirect', window.location.pathname.split('/').pop() || 'index.html');
      window.location.href = 'login.html';
    }
  });

  JFAuth.init();
})();
