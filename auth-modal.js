'use strict';
// ── Auth Modal + Header UI ────────────────────────────────────────────────────

(function () {

const MODAL_HTML = `
<div class="auth-modal-overlay" id="auth-overlay">
  <div class="auth-modal" role="dialog" aria-modal="true" aria-label="Login">
    <button class="auth-modal-close" id="auth-close" aria-label="Fechar">✕</button>
    <div class="auth-logo">☕</div>
    <div class="auth-title" id="auth-title">Entrar no JavaFácil</div>
    <div class="auth-sub" id="auth-sub">Salve seu progresso e acesse de qualquer lugar</div>

    <button class="btn-google" id="btn-google">
      <svg class="google-icon" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continuar com Google
    </button>

    <div class="auth-divider">ou</div>

    <div class="auth-error" id="auth-error"></div>

    <form class="auth-form" id="auth-form" autocomplete="on">
      <div class="auth-input-wrap">
        <span>📧</span>
        <input class="auth-input" id="auth-email" type="email"
               placeholder="seu@email.com" autocomplete="email" required>
      </div>
      <div class="auth-input-wrap">
        <span>🔒</span>
        <input class="auth-input" id="auth-password" type="password"
               placeholder="Senha" autocomplete="current-password" required minlength="6">
      </div>
      <div class="auth-input-wrap" id="auth-name-wrap" style="display:none">
        <span>👤</span>
        <input class="auth-input" id="auth-name" type="text"
               placeholder="Seu nome" autocomplete="name">
      </div>
      <button class="btn-auth-submit" type="submit" id="auth-submit">Entrar</button>
    </form>

    <div class="auth-toggle" id="auth-toggle">
      Não tem conta? <a id="auth-switch">Criar conta grátis</a>
    </div>
  </div>
</div>`;

const DROPDOWN_HTML = `
<div class="user-dropdown" id="user-dropdown">
  <div class="user-dropdown-header">
    <div class="user-dropdown-avatar" id="ud-avatar">👤</div>
    <div>
      <div class="user-dropdown-name" id="ud-name">Usuário</div>
      <div class="user-dropdown-email" id="ud-email"></div>
    </div>
  </div>
  <div class="user-dropdown-stats">
    <div class="ud-stat"><b id="ud-xp">0</b>XP</div>
    <div class="ud-stat"><b id="ud-streak">0</b>🔥</div>
    <div class="ud-stat"><b id="ud-done">0</b>✅</div>
  </div>
  <div class="user-dropdown-actions">
    <a class="ud-action" href="trilha.html">🗺️ Minha Trilha</a>
    <a class="ud-action" href="ide.html">💻 Abrir IDE</a>
    <button class="ud-action danger" id="ud-logout">🚪 Sair</button>
  </div>
</div>`;

// ── INJECT HTML ───────────────────────────────────────────────────────────────
function inject() {
  document.body.insertAdjacentHTML('beforeend', MODAL_HTML);
  document.body.insertAdjacentHTML('beforeend', DROPDOWN_HTML);
  _bindModal();
  _bindDropdown();
}

// ── HEADER BUTTON ─────────────────────────────────────────────────────────────
function _renderHeaderBtn(user, profile) {
  document.getElementById('jf-auth-btn')?.remove();

  // Target the nav-right div, fallback to nav-container
  const container = document.querySelector('.nav-right') ||
                    document.querySelector('.nav-container') ||
                    document.querySelector('.header');
  if (!container) return;

  const themeBtn = document.getElementById('btn-theme');

  if (user) {
    const btn = document.createElement('button');
    btn.id = 'jf-auth-btn';
    btn.className = 'user-avatar-btn';
    btn.title = user.displayName || user.email;
    btn.setAttribute('aria-label', 'Menu do usuário');

    if (user.photoURL) {
      btn.innerHTML = `<img src="${user.photoURL}" alt="avatar">`;
    } else {
      const initials = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
      btn.style.cssText = 'background:#4f46e5;color:#fff;font-weight:800;font-size:1rem;';
      btn.textContent = initials;
    }

    btn.addEventListener('click', e => {
      e.stopPropagation();
      _updateDropdown(user, profile);
      document.getElementById('user-dropdown').classList.toggle('open');
      document.getElementById('theme-panel')?.classList.remove('open');
    });

    themeBtn ? themeBtn.before(btn) : container.appendChild(btn);
  } else {
    const btn = document.createElement('button');
    btn.id = 'jf-auth-btn';
    btn.className = 'btn-login-header';
    btn.textContent = '🔑 Entrar';
    btn.addEventListener('click', () => openModal());
    themeBtn ? themeBtn.before(btn) : container.appendChild(btn);
  }
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
let _isRegister = false;

function openModal() {
  document.getElementById('auth-overlay').classList.add('open');
  document.getElementById('auth-email').focus();
}

function closeModal() {
  document.getElementById('auth-overlay').classList.remove('open');
  _clearError();
}

function _setMode(register) {
  _isRegister = register;
  document.getElementById('auth-title').textContent   = register ? 'Criar conta' : 'Entrar no JavaFácil';
  document.getElementById('auth-sub').textContent     = register ? 'Comece sua jornada Java hoje' : 'Salve seu progresso e acesse de qualquer lugar';
  document.getElementById('auth-submit').textContent  = register ? 'Criar conta' : 'Entrar';
  document.getElementById('auth-switch').textContent  = register ? 'Já tenho conta' : 'Criar conta grátis';
  document.getElementById('auth-toggle').innerHTML    = register
    ? 'Já tem conta? <a id="auth-switch">Entrar</a>'
    : 'Não tem conta? <a id="auth-switch">Criar conta grátis</a>';
  document.getElementById('auth-name-wrap').style.display = register ? '' : 'none';
  document.getElementById('auth-switch').addEventListener('click', () => _setMode(!_isRegister));
  _clearError();
}

function _showError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.classList.add('show');
}

function _clearError() {
  document.getElementById('auth-error')?.classList.remove('show');
}

function _bindModal() {
  document.getElementById('auth-close').addEventListener('click', closeModal);
  document.getElementById('auth-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('auth-overlay')) closeModal();
  });

  document.getElementById('auth-switch').addEventListener('click', () => _setMode(!_isRegister));

  document.getElementById('btn-google').addEventListener('click', async () => {
    _clearError();
    try {
      await JFAuth.loginGoogle();
      closeModal();
    } catch (e) {
      _showError(_friendlyError(e.code));
    }
  });

  document.getElementById('auth-form').addEventListener('submit', async e => {
    e.preventDefault();
    _clearError();
    const email    = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const name     = document.getElementById('auth-name').value.trim();
    const btn      = document.getElementById('auth-submit');

    btn.textContent = '⏳ Aguarde...';
    btn.disabled = true;

    try {
      const cred = await JFAuth.login(email, password, _isRegister);
      if (_isRegister && name && cred.user) {
        const { updateProfile } = window._fbAuth;
        await updateProfile(cred.user, { displayName: name });
      }
      closeModal();
    } catch (e) {
      _showError(_friendlyError(e.code));
    } finally {
      btn.textContent = _isRegister ? 'Criar conta' : 'Entrar';
      btn.disabled = false;
    }
  });
}

// ── DROPDOWN ──────────────────────────────────────────────────────────────────
function _updateDropdown(user, profile) {
  const p = profile || {};
  document.getElementById('ud-name').textContent   = user.displayName || user.email?.split('@')[0] || 'Usuário';
  document.getElementById('ud-email').textContent  = user.email || '';
  document.getElementById('ud-xp').textContent     = p.xp || 0;
  document.getElementById('ud-streak').textContent = p.streak || 0;
  document.getElementById('ud-done').textContent   = (p.completed || []).length;

  const av = document.getElementById('ud-avatar');
  if (user.photoURL) {
    av.innerHTML = `<img src="${user.photoURL}" alt="avatar">`;
  } else {
    av.textContent = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
    av.style.cssText = 'background:#4f46e5;color:#fff;font-weight:800;font-size:1.4rem;';
  }
}

function _bindDropdown() {
  document.addEventListener('click', e => {
    const dd = document.getElementById('user-dropdown');
    const btn = document.getElementById('jf-auth-btn');
    if (dd && !dd.contains(e.target) && e.target !== btn) {
      dd.classList.remove('open');
    }
  });

  document.getElementById('ud-logout').addEventListener('click', async () => {
    document.getElementById('user-dropdown').classList.remove('open');
    await JFAuth.logout();
  });
}

// ── ERROR MESSAGES ────────────────────────────────────────────────────────────
function _friendlyError(code) {
  const map = {
    'auth/user-not-found':       'Email não encontrado. Crie uma conta!',
    'auth/wrong-password':       'Senha incorreta. Tente novamente.',
    'auth/email-already-in-use': 'Este email já está cadastrado.',
    'auth/weak-password':        'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/invalid-email':        'Email inválido.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
    'auth/too-many-requests':    'Muitas tentativas. Aguarde um momento.',
  };
  return map[code] || 'Erro ao fazer login. Tente novamente.';
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  inject();

  // Init auth system
  if (window.JFAuth) {
    JFAuth.onAuthChange((user, profile) => {
      _renderHeaderBtn(user, profile);
      // Notify other modules
      document.dispatchEvent(new CustomEvent('jf:authchange', { detail: { user, profile } }));
    });
    await JFAuth.init();
  } else {
    // Firebase not configured — show login button that opens modal with info
    _renderHeaderBtn(null, null);
  }
});

// Expose openModal globally
window.JFAuthModal = { open: openModal, close: closeModal };

})();
