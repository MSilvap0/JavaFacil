'use strict';
// ── JavaFácil Auth — localStorage based ──────────────────────────────────────

window.JFAuth = {
  user: null,
  profile: null,
  init,
  login,
  loginGoogle,
  logout,
  register,
  saveProfile,
  loadProfile,
  onAuthChange,
};

let _callbacks = [];

// ── Simple hash (not cryptographic, just obfuscation for localStorage) ────────
async function _hash(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

function _getUsers() {
  try { return JSON.parse(localStorage.getItem('jf_users') || '{}'); } catch { return {}; }
}

function _saveUsers(users) {
  localStorage.setItem('jf_users', JSON.stringify(users));
}

function _defaultProfile(extra = {}) {
  return {
    xp: 0, streak: 0, lives: 5,
    completed: [], earnedBadges: [],
    theme: 'default', ideFiles: {},
    ...extra
  };
}

// ── INIT ──────────────────────────────────────────────────────────────────────
function init() {
  // Restore session
  try {
    const session = JSON.parse(localStorage.getItem('jf_session') || 'null');
    if (session?.email) {
      const users = _getUsers();
      const u = users[session.email];
      if (u) {
        JFAuth.user    = { email: u.email, displayName: u.name, photoURL: null, uid: u.email };
        JFAuth.profile = { ..._defaultProfile(), ...u.profile };
        _notify(JFAuth.user, JFAuth.profile);
        return;
      }
    }
  } catch(e) {}
  JFAuth.user    = null;
  JFAuth.profile = _defaultProfile();
  _notify(null, JFAuth.profile);
}

// ── REGISTER ──────────────────────────────────────────────────────────────────
async function register(name, email, password) {
  const users = _getUsers();
  if (users[email]) throw { code: 'auth/email-already-in-use' };
  const hash = await _hash(password);
  users[email] = { name, email, hash, profile: _defaultProfile() };
  _saveUsers(users);
  _setSession(users[email]);
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
async function login(email, password, isNew = false) {
  if (isNew) return register('', email, password);
  const users = _getUsers();
  const u = users[email];
  if (!u) throw { code: 'auth/user-not-found' };
  const hash = await _hash(password);
  if (hash !== u.hash) throw { code: 'auth/wrong-password' };
  _setSession(u);
}

function loginGoogle() {
  throw { code: 'auth/google-unavailable' };
}

// ── LOGOUT ────────────────────────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('jf_session');
  JFAuth.user    = null;
  JFAuth.profile = _defaultProfile();
  _notify(null, JFAuth.profile);
}

// ── SESSION ───────────────────────────────────────────────────────────────────
function _setSession(u) {
  localStorage.setItem('jf_session', JSON.stringify({ email: u.email }));
  JFAuth.user    = { email: u.email, displayName: u.name, photoURL: null, uid: u.email };
  JFAuth.profile = { ..._defaultProfile(), ...u.profile };
  _notify(JFAuth.user, JFAuth.profile);
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
async function saveProfile(data) {
  JFAuth.profile = { ...(JFAuth.profile || _defaultProfile()), ...data };
  if (JFAuth.user) {
    const users = _getUsers();
    if (users[JFAuth.user.email]) {
      users[JFAuth.user.email].profile = JFAuth.profile;
      _saveUsers(users);
    }
  }
}

function loadProfile() {
  return JFAuth.profile || _defaultProfile();
}

function onAuthChange(cb) { _callbacks.push(cb); }
function _notify(user, profile) {
  _callbacks.forEach(cb => { try { cb(user, profile); } catch(e){} });
}
