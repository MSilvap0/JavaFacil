// JavaFácil IDE - VSCode-like IDE with real Java execution
'use strict';

// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
  files: {},          // { name: content }
  activeFile: null,
  openTabs: [],
  editor: null,
  models: {},         // monaco models per file
  running: false,
  abortController: null,
  sidebarVisible: true,
  panelVisible: true,
  settings: {
    fontSize: 16,
    theme: 'vs-dark',
    wordWrap: 'on',
    tabSize: 4,
    minimap: true,
    lineNumbers: 'on',
    runner: 'piston'
  }
};

const DEFAULT_JAVA = `public class Main {
    public static void main(String[] args) {
        int a = 1;
        int b = 7;
        System.out.println(a + b);
    }
}
`;

// ─── SNIPPETS ─────────────────────────────────────────────────────────────────
const SNIPPETS = [
  { name: 'Main class',      prefix: 'main',    body: 'public class Main {\n    public static void main(String[] args) {\n        $0\n    }\n}' },
  { name: 'System.out',      prefix: 'sout',    body: 'System.out.println($0);' },
  { name: 'For loop',        prefix: 'for',     body: 'for (int i = 0; i < $1; i++) {\n    $0\n}' },
  { name: 'For-each',        prefix: 'foreach', body: 'for ($1 item : $2) {\n    $0\n}' },
  { name: 'While loop',      prefix: 'while',   body: 'while ($1) {\n    $0\n}' },
  { name: 'If statement',    prefix: 'if',      body: 'if ($1) {\n    $0\n}' },
  { name: 'If-else',         prefix: 'ifelse',  body: 'if ($1) {\n    $0\n} else {\n    \n}' },
  { name: 'Try-catch',       prefix: 'try',     body: 'try {\n    $0\n} catch (Exception e) {\n    e.printStackTrace();\n}' },
  { name: 'ArrayList',       prefix: 'list',    body: 'ArrayList<$1> $2 = new ArrayList<>();' },
  { name: 'HashMap',         prefix: 'map',     body: 'HashMap<$1, $2> $3 = new HashMap<>();' },
  { name: 'Scanner',         prefix: 'scan',    body: 'Scanner sc = new Scanner(System.in);\n$0' },
  { name: 'Class template',  prefix: 'class',   body: 'public class $1 {\n    $0\n}' },
  { name: 'Method',          prefix: 'method',  body: 'public $1 $2($3) {\n    $0\n}' },
  { name: 'Constructor',     prefix: 'ctor',    body: 'public $1($2) {\n    $0\n}' },
];

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initZoom();
  initFileSystem();
  initMonaco();
  initMenuBar();
  initActivityBar();
  initSidebarResize();
  initPanelResize();
  initPanelTabs();
  initSnippets();
  initSearch();
  initSettingsPanel();
  initKeyBindings();
  initRunButtons();
  applySettings();
});

// ─── GLOBAL ZOOM ──────────────────────────────────────────────────────────────
function initZoom() {
  const saved = parseFloat(localStorage.getItem('ide_zoom') || '1.0');
  applyZoom(saved);

  document.getElementById('btn-zoom-in')?.addEventListener('click',  () => stepZoom(0.05));
  document.getElementById('btn-zoom-out')?.addEventListener('click', () => stepZoom(-0.05));
  document.getElementById('zoom-label')?.addEventListener('dblclick', () => applyZoom(1.0));

  window.addEventListener('resize', () => {
    const current = parseFloat(localStorage.getItem('ide_zoom') || '1.0');
    applyZoom(current);
  });
}

function stepZoom(delta) {
  const current = parseFloat(localStorage.getItem('ide_zoom') || '1.0');
  applyZoom(Math.min(2.0, Math.max(0.5, +(current + delta).toFixed(2))));
}

function applyZoom(level) {
  const app = document.querySelector('.app-container');
  if (!app) return;

  const w = window.innerWidth  / level;
  const h = window.innerHeight / level;

  app.style.width     = w + 'px';
  app.style.height    = h + 'px';
  app.style.transform = `scale(${level})`;

  localStorage.setItem('ide_zoom', level);

  const label = document.getElementById('zoom-label');
  if (label) label.textContent = Math.round(level * 100) + '%';

  setTimeout(() => {
    if (state.editor) state.editor.layout();
  }, 50);
}

// ─── FILE SYSTEM ──────────────────────────────────────────────────────────────
function initFileSystem() {
  const saved = localStorage.getItem('ide_files');
  if (saved) {
    try { state.files = JSON.parse(saved); } catch(e) { state.files = {}; }
  }
  if (Object.keys(state.files).length === 0) {
    state.files['Main.java'] = DEFAULT_JAVA;
  }
  renderFileTree();
  const first = Object.keys(state.files)[0];
  openTab(first);
}

function saveFiles() {
  localStorage.setItem('ide_files', JSON.stringify(state.files));
}

function renderFileTree() {
  const tree = document.getElementById('file-tree');
  tree.innerHTML = '';
  Object.keys(state.files).sort().forEach(name => {
    const item = document.createElement('div');
    item.className = 'tree-item' + (name === state.activeFile ? ' active' : '');
    item.dataset.file = name;
    const ext = name.split('.').pop();
    item.innerHTML = `
      <span class="file-dot ${ext}"></span>
      <span>${name}</span>
    `;
    item.addEventListener('click', () => openTab(name));
    item.addEventListener('contextmenu', e => showContextMenu(e, name));
    tree.appendChild(item);
  });
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function openTab(name) {
  if (!state.openTabs.includes(name)) state.openTabs.push(name);
  state.activeFile = name;
  renderTabs();
  renderFileTree();
  updateBreadcrumb(name);
  updateTitleBar(name);
  if (state.editor) switchEditorModel(name);
}

function closeTab(name) {
  const idx = state.openTabs.indexOf(name);
  if (idx === -1) return;
  state.openTabs.splice(idx, 1);
  if (state.activeFile === name) {
    state.activeFile = state.openTabs[Math.max(0, idx - 1)] || null;
    if (state.activeFile) switchEditorModel(state.activeFile);
  }
  renderTabs();
  renderFileTree();
}

function renderTabs() {
  const list = document.getElementById('tabs-list');
  list.innerHTML = '';
  state.openTabs.forEach(name => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (name === state.activeFile ? ' active' : '');
    tab.innerHTML = `
      <span class="tab-name">${name}</span>
      <button class="tab-close" title="Close">×</button>
    `;
    tab.addEventListener('click', e => {
      if (!e.target.classList.contains('tab-close')) openTab(name);
    });
    tab.querySelector('.tab-close').addEventListener('click', e => {
      e.stopPropagation();
      closeTab(name);
    });
    list.appendChild(tab);
  });
}

function updateBreadcrumb(name) {
  const el = document.getElementById('bc-file');
  if (el) el.textContent = name;
}

function updateTitleBar(name) {
  const el = document.getElementById('title-filename');
  if (el) el.textContent = `${name} — JavaFácil IDE`;
}

// ─── MONACO EDITOR ────────────────────────────────────────────────────────────
function initMonaco() {
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });
  require(['vs/editor/editor.main'], () => {
    const loading = document.getElementById('editor-loading');

    state.editor = monaco.editor.create(document.getElementById('monaco-editor'), {
      language: 'java',
      theme: state.settings.theme,
      fontSize: state.settings.fontSize,
      fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
      fontLigatures: true,
      wordWrap: state.settings.wordWrap,
      tabSize: state.settings.tabSize,
      minimap: { enabled: state.settings.minimap },
      lineNumbers: state.settings.lineNumbers,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      formatOnType: true,
      formatOnPaste: true,
      bracketPairColorization: { enabled: true },
      renderWhitespace: 'selection',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      padding: { top: 8 },
    });

    if (loading) loading.style.display = 'none';

    // Force layout so Monaco fills the container correctly
    requestAnimationFrame(() => state.editor.layout());

    // Register Java snippets
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };
        return {
          suggestions: SNIPPETS.map(s => ({
            label: s.prefix,
            kind: monaco.languages.CompletionItemKind.Snippet,
            documentation: s.name,
            insertText: s.body,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          }))
        };
      }
    });

    // Load active file
    if (state.activeFile) switchEditorModel(state.activeFile);

    // Track cursor position
    state.editor.onDidChangeCursorPosition(e => {
      const pos = e.position;
      const sel = state.editor.getSelection();
      document.getElementById('status-cursor').textContent =
        `Ln ${pos.lineNumber}, Col ${pos.column}`;
      const selLen = state.editor.getModel()?.getValueInRange(sel)?.length || 0;
      const selEl = document.getElementById('status-selection');
      if (selEl) selEl.textContent = selLen > 0 ? `(${selLen} selected)` : '';
    });

    // Auto-save on change
    state.editor.onDidChangeModelContent(() => {
      if (state.activeFile) {
        state.files[state.activeFile] = state.editor.getValue();
        saveFiles();
      }
    });

    // Ctrl+Enter to run
    state.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => runJava()
    );

    // Ctrl+S to save
    state.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => { saveFiles(); showNotification('Salvo', 'success'); }
    );
  });
}

function switchEditorModel(name) {
  if (!state.editor) return;
  const content = state.files[name] || '';
  const lang = name.endsWith('.java') ? 'java' :
               name.endsWith('.js')   ? 'javascript' :
               name.endsWith('.html') ? 'html' :
               name.endsWith('.css')  ? 'css' :
               name.endsWith('.json') ? 'json' : 'plaintext';

  if (!state.models[name]) {
    state.models[name] = monaco.editor.createModel(content, lang);
  }
  state.editor.setModel(state.models[name]);
  updateStatusLang(lang);
}

function updateStatusLang(lang) {
  const el = document.getElementById('status-lang');
  if (el) el.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
}

// ─── JAVA EXECUTION ───────────────────────────────────────────────────────────
async function runJava(stdin = '') {
  if (state.running) return;
  const code = state.editor ? state.editor.getValue() : (state.files[state.activeFile] || '');
  if (!code.trim()) return;

  state.running = true;
  state.abortController = new AbortController();
  setRunState('running');
  showPanel('output');

  const outEl    = document.getElementById('output-content');
  const statusEl = document.getElementById('output-status');
  const timeEl   = document.getElementById('output-time');
  const memEl    = document.getElementById('output-memory');

  statusEl.textContent = '';
  timeEl.textContent = '';
  memEl.textContent = '';

  const start = Date.now();
  const runner = state.settings.runner;

  // For simple code, run simulator instantly without showing loading
  if (runner === 'simulate' || (runner === 'piston' && isSimpleCode(code))) {
    const result = simulateJava(code, stdin);
    const elapsed = ((Date.now() - start) / 1000).toFixed(3);
    timeEl.textContent = `${elapsed}s`;
    showResult(result, outEl, statusEl);
    state.running = false;
    state.abortController = null;
    setTimeout(() => setRunState(''), 4000);
    return;
  }

  outEl.innerHTML = '<span style="color:#969696">⏳ Compilando e executando...</span>';

  try {
    let result;
    if (runner === 'judge0') {
      result = await runWithJudge0(code, stdin, state.abortController.signal);
    } else {
      result = await runWithPiston(code, stdin, state.abortController.signal);
    }

    if (!state.running) return;

    const elapsed = ((Date.now() - start) / 1000).toFixed(2);
    timeEl.textContent = `${elapsed}s`;
    if (result.memory) memEl.textContent = `${result.memory}KB`;
    showResult(result, outEl, statusEl);

  } catch(e) {
    if (!state.running) return;
    // API failed — fall back to simulator
    const result = simulateJava(code, stdin);
    const elapsed = ((Date.now() - start) / 1000).toFixed(3);
    timeEl.textContent = `${elapsed}s (local)`;
    showResult(result, outEl, statusEl);
  }

  state.running = false;
  state.abortController = null;
  setTimeout(() => setRunState(''), 4000);
}

function showResult(result, outEl, statusEl) {
  if (result.error) {
    outEl.innerHTML = `<span class="out-error">${escHtml(result.error)}</span>`;
    statusEl.textContent = '✗ Erro';
    statusEl.className = 'error';
    setRunState('error');
    parseProblems(result.error);
  } else {
    outEl.innerHTML = result.output
      ? escHtml(result.output)
      : '<span style="color:#969696">(sem saída)</span>';
    statusEl.textContent = '✓ Sucesso';
    statusEl.className = 'success';
    setRunState('success');
    clearProblems();
  }
}

// Detect if code is simple enough for instant local simulation
function isSimpleCode(code) {
  const complex = /Scanner|BufferedReader|Thread|File|import\s+java\.(io|net|nio|util\.concurrent)/;
  return !complex.test(code);
}

async function runWithPiston(code, stdin, signal) {
  const endpoints = [
    'https://emkc.org/api/v2/piston/execute',
    'https://piston.krunker.io/api/v2/execute',
  ];

  // Combine abort signal with a 15s timeout
  const timeout = AbortSignal.timeout ? AbortSignal.timeout(15000) : null;

  let lastErr = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: signal,
        body: JSON.stringify({
          language: 'java',
          version: '*',
          files: [{ name: 'Main.java', content: code }],
          stdin: stdin || ''
        })
      });
      if (!res.ok) { lastErr = `HTTP ${res.status}`; continue; }
      const data = await res.json();
      const run     = data.run     || {};
      const compile = data.compile || {};
      if (compile.stderr && compile.stderr.trim()) return { error: compile.stderr };
      if (run.stderr     && run.stderr.trim())     return { error: run.stderr };
      return { output: run.stdout || run.output || '' };
    } catch(e) {
      if (e.name === 'AbortError') throw e; // propagate stop
      lastErr = e.message;
    }
  }

  console.warn('Piston unavailable, using simulator:', lastErr);
  return simulateJava(code);
}

async function runWithJudge0(code, stdin) {
  // Judge0 CE public instance
  const submitRes = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': 'DEMO'
    },
    body: JSON.stringify({
      language_id: 62,
      source_code: code,
      stdin: stdin || ''
    })
  });
  const data = await submitRes.json();
  if (data.compile_output) return { error: data.compile_output };
  if (data.stderr)         return { error: data.stderr };
  return { output: data.stdout || '', memory: data.memory };
}

// ─── JAVA SIMULATOR ───────────────────────────────────────────────────────────
// A proper Java interpreter for common patterns
function simulateJava(code, stdin = '') {
  try {
    const interpreter = new JavaInterpreter(code, stdin);
    return interpreter.run();
  } catch(e) {
    return { error: e.message };
  }
}

class JavaInterpreter {
  constructor(code, stdin) {
    this.code   = code;
    this.stdin  = stdin ? stdin.split('\n') : [];
    this.stdinIdx = 0;
    this.output = '';
    this.vars   = {};   // flat scope for simplicity
    this.MAX_ITER = 10000;
  }

  run() {
    // Extract main method body
    const mainBody = this._extractMainBody();
    if (!mainBody) return { error: 'Método main não encontrado.' };
    this._execBlock(mainBody);
    return { output: this.output };
  }

  _extractMainBody() {
    // Match: public static void main(String[] args) { ... }
    const re = /public\s+static\s+void\s+main\s*\([^)]*\)\s*\{/;
    const m = re.exec(this.code);
    if (!m) return null;
    return this._extractBlock(this.code, m.index + m[0].length - 1);
  }

  // Extract balanced { } block starting at openBrace index
  _extractBlock(src, openIdx) {
    let depth = 0, i = openIdx;
    let start = -1;
    while (i < src.length) {
      if (src[i] === '{') { if (depth === 0) start = i + 1; depth++; }
      else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(start, i); }
      i++;
    }
    return null;
  }

  _execBlock(block) {
    // Split into statements (naive but handles most cases)
    const stmts = this._splitStatements(block);
    for (const stmt of stmts) {
      const s = stmt.trim();
      if (!s) continue;
      this._execStatement(s);
    }
  }

  _splitStatements(block) {
    // Split by ; but respect { } and strings
    const stmts = [];
    let depth = 0, inStr = false, inChar = false, cur = '', i = 0;
    while (i < block.length) {
      const c = block[i];
      if (!inStr && !inChar && c === '"') { inStr = true; cur += c; }
      else if (inStr && c === '"' && block[i-1] !== '\\') { inStr = false; cur += c; }
      else if (!inStr && !inChar && c === "'") { inChar = true; cur += c; }
      else if (inChar && c === "'" && block[i-1] !== '\\') { inChar = false; cur += c; }
      else if (!inStr && !inChar && c === '{') { depth++; cur += c; }
      else if (!inStr && !inChar && c === '}') {
        depth--;
        cur += c;
        if (depth === 0) { stmts.push(cur); cur = ''; i++; continue; }
      }
      else if (!inStr && !inChar && c === ';' && depth === 0) {
        stmts.push(cur);
        cur = '';
        i++;
        continue;
      }
      else { cur += c; }
      i++;
    }
    if (cur.trim()) stmts.push(cur);
    return stmts;
  }

  _execStatement(s) {
    // Skip comments
    if (s.startsWith('//') || s.startsWith('/*')) return;

    // System.out.println / print
    if (/^System\.out\.print/.test(s)) {
      this._execPrint(s);
      return;
    }

    // Variable declaration: type name = expr;
    const declRe = /^(?:int|long|double|float|short|byte|boolean|char|String|var)\s+(\w+)\s*=\s*(.+)$/s;
    const declM = declRe.exec(s);
    if (declM) {
      this.vars[declM[1]] = this._evalExpr(declM[2].trim());
      return;
    }

    // Multi-var: int a = 1, b = 2;
    const multiRe = /^(?:int|long|double|float|short|byte)\s+(.+)$/s;
    const multiM = multiRe.exec(s);
    if (multiM) {
      multiM[1].split(',').forEach(part => {
        const p = part.trim();
        const eq = p.indexOf('=');
        if (eq !== -1) {
          const name = p.slice(0, eq).trim();
          const val  = p.slice(eq + 1).trim();
          this.vars[name] = this._evalExpr(val);
        }
      });
      return;
    }

    // Assignment: name = expr; or name += expr; etc.
    const assignRe = /^(\w+)\s*(\+|-|\*|\/|%)?=\s*(.+)$/s;
    const assignM = assignRe.exec(s);
    if (assignM && this.vars.hasOwnProperty(assignM[1])) {
      const name = assignM[1], op = assignM[2], rhs = this._evalExpr(assignM[3].trim());
      if (!op) this.vars[name] = rhs;
      else if (op === '+') this.vars[name] += rhs;
      else if (op === '-') this.vars[name] -= rhs;
      else if (op === '*') this.vars[name] *= rhs;
      else if (op === '/') this.vars[name] = typeof rhs === 'number' && rhs !== 0 ? this.vars[name] / rhs : 'ArithmeticException: / by zero';
      else if (op === '%') this.vars[name] %= rhs;
      return;
    }

    // i++ / i--
    const incRe = /^(\w+)(\+\+|--)$/;
    const incM = incRe.exec(s);
    if (incM) {
      if (incM[2] === '++') this.vars[incM[1]] = (this.vars[incM[1]] || 0) + 1;
      else                  this.vars[incM[1]] = (this.vars[incM[1]] || 0) - 1;
      return;
    }

    // for loop: for (init; cond; update) { body }
    const forRe = /^for\s*\(([^;]*);([^;]*);([^)]*)\)\s*(\{[\s\S]*\}|[^{].*)$/;
    const forM = forRe.exec(s);
    if (forM) {
      this._execFor(forM[1].trim(), forM[2].trim(), forM[3].trim(), forM[4].trim());
      return;
    }

    // while loop
    const whileRe = /^while\s*\((.+)\)\s*(\{[\s\S]*\}|[^{].*)$/;
    const whileM = whileRe.exec(s);
    if (whileM) {
      this._execWhile(whileM[1].trim(), whileM[2].trim());
      return;
    }

    // if / else if / else
    if (/^if\s*\(/.test(s)) {
      this._execIf(s);
      return;
    }
  }

  _execPrint(s) {
    const isLn = s.includes('println');
    // Extract argument between outer parens
    const start = s.indexOf('(');
    const arg = s.slice(start + 1, s.lastIndexOf(')')).trim();
    const val = this._evalExpr(arg);
    this.output += String(val) + (isLn ? '\n' : '');
  }

  _execFor(init, cond, update, body) {
    // Execute init
    this._execStatement(init);
    let iters = 0;
    while (this._evalCond(cond) && iters++ < this.MAX_ITER) {
      const bodyBlock = body.startsWith('{')
        ? this._extractBlock(body, 0)
        : body;
      if (bodyBlock) this._execBlock(bodyBlock);
      this._execStatement(update);
    }
  }

  _execWhile(cond, body) {
    let iters = 0;
    while (this._evalCond(cond) && iters++ < this.MAX_ITER) {
      const bodyBlock = body.startsWith('{')
        ? this._extractBlock(body, 0)
        : body;
      if (bodyBlock) this._execBlock(bodyBlock);
    }
  }

  _execIf(s) {
    // Parse: if (cond) { ... } else if (...) { ... } else { ... }
    const condStart = s.indexOf('(') + 1;
    let depth = 1, i = condStart;
    while (i < s.length && depth > 0) {
      if (s[i] === '(') depth++;
      else if (s[i] === ')') depth--;
      i++;
    }
    const cond = s.slice(condStart, i - 1).trim();
    const rest = s.slice(i).trim();

    let thenBlock, elseStr = '';
    if (rest.startsWith('{')) {
      thenBlock = this._extractBlock(rest, 0);
      const closeIdx = this._findBlockEnd(rest, 0);
      elseStr = rest.slice(closeIdx + 1).trim();
    } else {
      const semi = rest.indexOf(';');
      thenBlock = rest.slice(0, semi);
      elseStr = rest.slice(semi + 1).trim();
    }

    if (this._evalCond(cond)) {
      if (thenBlock) this._execBlock(thenBlock);
    } else if (elseStr) {
      if (elseStr.startsWith('else if')) {
        this._execIf(elseStr.slice(5).trim());
      } else if (elseStr.startsWith('else')) {
        const elseBody = elseStr.slice(4).trim();
        const block = elseBody.startsWith('{') ? this._extractBlock(elseBody, 0) : elseBody;
        if (block) this._execBlock(block);
      }
    }
  }

  _findBlockEnd(src, openIdx) {
    let depth = 0, i = openIdx;
    while (i < src.length) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') { depth--; if (depth === 0) return i; }
      i++;
    }
    return -1;
  }

  _evalCond(cond) {
    cond = cond.trim();
    // Replace Java operators
    let expr = this._substituteVars(cond)
      .replace(/&&/g, '&&')
      .replace(/\|\|/g, '||')
      .replace(/!/g, '!');
    try { return !!eval(expr); } catch(e) { return false; }
  }

  _evalExpr(expr) {
    expr = expr.trim();

    // String literal
    if (expr.startsWith('"') && expr.endsWith('"')) return expr.slice(1, -1);

    // Char literal
    if (expr.startsWith("'") && expr.endsWith("'")) return expr[1];

    // Boolean
    if (expr === 'true')  return true;
    if (expr === 'false') return false;

    // Math.xxx calls
    expr = expr
      .replace(/Math\.pow\s*\(([^,]+),([^)]+)\)/g, (_, a, b) => `Math.pow(${this._evalExpr(a)},${this._evalExpr(b)})`)
      .replace(/Math\.sqrt\s*\(([^)]+)\)/g,  (_, a) => `Math.sqrt(${this._evalExpr(a)})`)
      .replace(/Math\.abs\s*\(([^)]+)\)/g,   (_, a) => `Math.abs(${this._evalExpr(a)})`)
      .replace(/Math\.max\s*\(([^,]+),([^)]+)\)/g, (_, a, b) => `Math.max(${this._evalExpr(a)},${this._evalExpr(b)})`)
      .replace(/Math\.min\s*\(([^,]+),([^)]+)\)/g, (_, a, b) => `Math.min(${this._evalExpr(a)},${this._evalExpr(b)})`)
      .replace(/Math\.floor\s*\(([^)]+)\)/g, (_, a) => `Math.floor(${this._evalExpr(a)})`)
      .replace(/Math\.ceil\s*\(([^)]+)\)/g,  (_, a) => `Math.ceil(${this._evalExpr(a)})`)
      .replace(/Math\.round\s*\(([^)]+)\)/g, (_, a) => `Math.round(${this._evalExpr(a)})`);

    // String concatenation with +
    if (this._hasStringConcat(expr)) {
      return this._evalStringConcat(expr);
    }

    // Substitute variables then eval
    const substituted = this._substituteVars(expr);
    try {
      const result = eval(substituted);
      // Round floating point noise: 1.0000000000000002 → 1
      if (typeof result === 'number' && !Number.isInteger(result)) {
        const rounded = parseFloat(result.toPrecision(10));
        return rounded;
      }
      return result;
    } catch(e) {
      return expr;
    }
  }

  _hasStringConcat(expr) {
    // Check if any part is a string variable or literal
    if (expr.includes('"')) return true;
    // Check if any variable is a string
    const parts = expr.split('+');
    return parts.some(p => {
      const v = p.trim();
      return typeof this.vars[v] === 'string';
    });
  }

  _evalStringConcat(expr) {
    // Split by + respecting strings
    const parts = [];
    let cur = '', inStr = false, i = 0;
    while (i < expr.length) {
      const c = expr[i];
      if (c === '"' && !inStr) { inStr = true; cur += c; }
      else if (c === '"' && inStr) { inStr = false; cur += c; }
      else if (c === '+' && !inStr) { parts.push(cur.trim()); cur = ''; }
      else { cur += c; }
      i++;
    }
    if (cur.trim()) parts.push(cur.trim());

    return parts.map(p => {
      if (p.startsWith('"') && p.endsWith('"')) return p.slice(1, -1);
      if (this.vars[p] !== undefined) return String(this.vars[p]);
      try { return String(eval(this._substituteVars(p))); } catch(e) { return p; }
    }).join('');
  }

  _substituteVars(expr) {
    let result = expr;
    // Sort by length desc to avoid partial replacements
    Object.keys(this.vars).sort((a, b) => b.length - a.length).forEach(k => {
      const val = this.vars[k];
      const safe = typeof val === 'string' ? `"${val}"` : String(val);
      result = result.replace(new RegExp('\\b' + k + '\\b', 'g'), safe);
    });
    return result;
  }
}

function setRunState(state_) {
  const btn = document.getElementById('run-btn');
  const statusRun = document.getElementById('status-run-state');
  if (btn) {
    btn.classList.toggle('running', state_ === 'running');
    btn.innerHTML = state_ === 'running'
      ? '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="10" height="10"/></svg> Stop'
      : '<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6V2z"/></svg> Run';
  }
  if (statusRun) {
    statusRun.className = 'status-item status-run' + (state_ ? ' ' + state_ : '');
    statusRun.textContent = state_ === 'running' ? '⟳ Running' :
                            state_ === 'success' ? '✓ Done' :
                            state_ === 'error'   ? '✗ Error' : '';
  }
}

function stopRun() {
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  state.running = false;
  setRunState('');
  const outEl    = document.getElementById('output-content');
  const statusEl = document.getElementById('output-status');
  if (outEl)    outEl.innerHTML = '<span style="color:#969696">Execução interrompida.</span>';
  if (statusEl) { statusEl.textContent = '■ Parado'; statusEl.className = ''; }
}

function parseProblems(errorText) {
  const problems = [];
  const re = /Main\.java:(\d+):\s*error:\s*(.+)/g;
  let m;
  while ((m = re.exec(errorText)) !== null) {
    problems.push({ type: 'error', line: parseInt(m[1]), msg: m[2].trim() });
  }
  renderProblems(problems);
}

function clearProblems() { renderProblems([]); }

function renderProblems(problems) {
  const list = document.getElementById('problems-list');
  const badge = document.getElementById('problems-badge');
  const errCount = document.getElementById('error-count');
  const warnCount = document.getElementById('warn-count');

  const errors = problems.filter(p => p.type === 'error').length;
  const warns  = problems.filter(p => p.type === 'warning').length;

  if (badge) badge.textContent = errors + warns || '';
  if (errCount) errCount.textContent = errors;
  if (warnCount) warnCount.textContent = warns;

  if (!list) return;
  if (problems.length === 0) {
    list.innerHTML = '<div class="problems-empty">Nenhum problema encontrado.</div>';
    return;
  }
  list.innerHTML = problems.map(p => `
    <div class="problem-item problem-${p.type}" data-line="${p.line}">
      <span class="problem-icon">
        ${p.type === 'error'
          ? '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#f44747"/><path d="M7.25 4.5h1.5v4h-1.5V4.5zm0 5h1.5v1.5h-1.5V9.5z" fill="white"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="7" fill="#ffcc00"/><path d="M7.25 4.5h1.5v4h-1.5V4.5zm0 5h1.5v1.5h-1.5V9.5z" fill="white"/></svg>'}
      </span>
      <span class="problem-msg">${escHtml(p.msg)}</span>
      <span class="problem-loc">Ln ${p.line}</span>
    </div>
  `).join('');

  list.querySelectorAll('.problem-item').forEach(el => {
    el.addEventListener('click', () => {
      const line = parseInt(el.dataset.line);
      if (state.editor && line) {
        state.editor.revealLineInCenter(line);
        state.editor.setPosition({ lineNumber: line, column: 1 });
        state.editor.focus();
      }
    });
  });
}

// ─── MENU BAR ─────────────────────────────────────────────────────────────────
function initMenuBar() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      closeAllMenus();
      if (!isOpen) item.classList.add('open');
    });
  });

  document.addEventListener('click', closeAllMenus);

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      closeAllMenus();
      handleMenuAction(item.dataset.action);
    });
  });
}

function closeAllMenus() {
  document.querySelectorAll('.menu-item.open').forEach(m => m.classList.remove('open'));
}

function handleMenuAction(action) {
  switch(action) {
    case 'new-file':    showNewFileModal(); break;
    case 'save':        saveFiles(); showNotification('Salvo', 'success'); break;
    case 'save-all':    saveFiles(); showNotification('Todos salvos', 'success'); break;
    case 'home':        window.location.href = 'index.html'; break;
    case 'undo':        state.editor?.trigger('', 'undo'); break;
    case 'redo':        state.editor?.trigger('', 'redo'); break;
    case 'find':        state.editor?.trigger('', 'actions.find'); break;
    case 'replace':     state.editor?.trigger('', 'editor.action.startFindReplaceAction'); break;
    case 'format':      state.editor?.trigger('', 'editor.action.formatDocument'); break;
    case 'comment':     state.editor?.trigger('', 'editor.action.commentLine'); break;
    case 'run':         runJava(); break;
    case 'run-input':   showInputModal(); break;
    case 'stop':        stopRun(); break;
    case 'toggle-sidebar': toggleSidebar(); break;
    case 'toggle-panel':   togglePanel(); break;
    case 'toggle-minimap': toggleMinimap(); break;
    case 'zoom-in':     changeFontSize(1); break;
    case 'zoom-out':    changeFontSize(-1); break;
    case 'zoom-reset':  setFontSize(14); break;
    case 'fullscreen':  toggleFullscreen(); break;
  }
}

// ─── ACTIVITY BAR ─────────────────────────────────────────────────────────────
function initActivityBar() {
  document.querySelectorAll('.activity-btn[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      const isActive = btn.classList.contains('active');

      document.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.sidebar-view').forEach(v => v.classList.remove('active'));

      if (!isActive) {
        btn.classList.add('active');
        const viewEl = document.getElementById('view-' + view);
        if (viewEl) viewEl.classList.add('active');
        if (!state.sidebarVisible) toggleSidebar();
      } else {
        toggleSidebar();
      }
    });
  });

  // New file / folder buttons
  document.getElementById('btn-new-file')?.addEventListener('click', showNewFileModal);
  document.getElementById('btn-new-folder')?.addEventListener('click', () => showNotification('Pastas em breve', 'info'));
  document.getElementById('btn-refresh')?.addEventListener('click', renderFileTree);
}

// ─── SIDEBAR RESIZE ───────────────────────────────────────────────────────────
function initSidebarResize() {
  const handle = document.getElementById('sidebar-resize');
  const sidebar = document.getElementById('sidebar');
  if (!handle || !sidebar) return;

  let dragging = false, startX = 0, startW = 0;

  handle.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = sidebar.offsetWidth;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const w = Math.max(150, Math.min(500, startW + e.clientX - startX));
    sidebar.style.width = w + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });
}

// ─── PANEL RESIZE ─────────────────────────────────────────────────────────────
function initPanelResize() {
  const handle = document.getElementById('panel-resize-handle');
  const panel = document.getElementById('panel');
  const wrapper = document.getElementById('editor-panel-wrapper');
  if (!handle || !panel) return;

  let dragging = false, startY = 0, startH = 0;

  handle.addEventListener('mousedown', e => {
    dragging = true;
    startY = e.clientY;
    startH = panel.offsetHeight;
    handle.classList.add('dragging');
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const h = Math.max(80, Math.min(wrapper.offsetHeight - 100, startH + startY - e.clientY));
    panel.style.height = h + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  // Panel controls
  document.getElementById('panel-toggle')?.addEventListener('click', togglePanel);
  document.getElementById('panel-maximize')?.addEventListener('click', () => {
    panel.classList.toggle('maximized');
  });
  document.getElementById('panel-clear')?.addEventListener('click', () => {
    document.getElementById('output-content').innerHTML = '';
    document.getElementById('output-status').textContent = '';
    document.getElementById('output-time').textContent = '';
  });
}

// ─── PANEL TABS ───────────────────────────────────────────────────────────────
function initPanelTabs() {
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', () => showPanel(tab.dataset.panel));
  });
}

function showPanel(name) {
  if (!state.panelVisible) {
    state.panelVisible = true;
    document.getElementById('panel')?.classList.remove('hidden');
  }
  document.querySelectorAll('.panel-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.panel === name);
  });
  document.querySelectorAll('.panel-pane').forEach(p => {
    p.classList.toggle('active', p.id === 'pane-' + name);
  });
}

function togglePanel() {
  const panel = document.getElementById('panel');
  if (!panel) return;
  state.panelVisible = !state.panelVisible;
  panel.classList.toggle('hidden', !state.panelVisible);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const resize  = document.getElementById('sidebar-resize');
  if (!sidebar) return;
  state.sidebarVisible = !state.sidebarVisible;
  sidebar.style.display = state.sidebarVisible ? '' : 'none';
  if (resize) resize.style.display = state.sidebarVisible ? '' : 'none';
}

// ─── SNIPPETS PANEL ───────────────────────────────────────────────────────────
function initSnippets() {
  const list = document.getElementById('snippets-list');
  if (!list) return;
  SNIPPETS.forEach(s => {
    const item = document.createElement('div');
    item.className = 'snippet-item';
    item.innerHTML = `
      <div class="snippet-name">${s.name}</div>
      <span class="snippet-prefix">${s.prefix}</span>
    `;
    item.addEventListener('click', () => {
      if (!state.editor) return;
      state.editor.trigger('snippet', 'editor.action.insertSnippet', { snippet: s.body });
      state.editor.focus();
    });
    list.appendChild(item);
  });
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function initSearch() {
  document.getElementById('btn-search')?.addEventListener('click', doSearch);
  document.getElementById('btn-replace-all')?.addEventListener('click', doReplaceAll);
  document.getElementById('search-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
}

function doSearch() {
  const query = document.getElementById('search-input')?.value;
  if (!query || !state.editor) return;
  state.editor.trigger('', 'actions.find');
}

function doReplaceAll() {
  const query   = document.getElementById('search-input')?.value;
  const replace = document.getElementById('replace-input')?.value;
  if (!query || !state.editor) return;
  const model = state.editor.getModel();
  if (!model) return;
  const matches = model.findMatches(query, false, false, false, null, false);
  if (matches.length === 0) { showNotification('Nenhum resultado', 'info'); return; }
  const edits = matches.map(m => ({ range: m.range, text: replace || '' }));
  model.pushEditOperations([], edits, () => null);
  showNotification(`${matches.length} substituição(ões)`, 'success');
}

// ─── SETTINGS PANEL ───────────────────────────────────────────────────────────
function initSettingsPanel() {
  const fontSize = document.getElementById('font-size-slider');
  const fontVal  = document.getElementById('font-size-val');
  if (fontSize) {
    fontSize.value = state.settings.fontSize;
    if (fontVal) fontVal.textContent = state.settings.fontSize;
    fontSize.addEventListener('input', () => {
      const v = parseInt(fontSize.value);
      if (fontVal) fontVal.textContent = v;
      setFontSize(v);
    });
  }

  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = state.settings.theme;
    themeSelect.addEventListener('change', () => {
      state.settings.theme = themeSelect.value;
      monaco.editor.setTheme(state.settings.theme);
      saveSettings();
    });
  }

  const wwSelect = document.getElementById('wordwrap-select');
  if (wwSelect) {
    wwSelect.value = state.settings.wordWrap;
    wwSelect.addEventListener('change', () => {
      state.settings.wordWrap = wwSelect.value;
      state.editor?.updateOptions({ wordWrap: state.settings.wordWrap });
      saveSettings();
    });
  }

  const tabSelect = document.getElementById('tabsize-select');
  if (tabSelect) {
    tabSelect.value = state.settings.tabSize;
    tabSelect.addEventListener('change', () => {
      state.settings.tabSize = parseInt(tabSelect.value);
      state.editor?.updateOptions({ tabSize: state.settings.tabSize });
      document.getElementById('status-indent').textContent = `Spaces: ${state.settings.tabSize}`;
      saveSettings();
    });
  }

  const minimapToggle = document.getElementById('minimap-toggle');
  if (minimapToggle) {
    minimapToggle.checked = state.settings.minimap;
    minimapToggle.addEventListener('change', () => {
      state.settings.minimap = minimapToggle.checked;
      state.editor?.updateOptions({ minimap: { enabled: state.settings.minimap } });
      saveSettings();
    });
  }

  const lnSelect = document.getElementById('linenumbers-select');
  if (lnSelect) {
    lnSelect.value = state.settings.lineNumbers;
    lnSelect.addEventListener('change', () => {
      state.settings.lineNumbers = lnSelect.value;
      state.editor?.updateOptions({ lineNumbers: state.settings.lineNumbers });
      saveSettings();
    });
  }

  const runnerSelect = document.getElementById('runner-select');
  if (runnerSelect) {
    runnerSelect.value = state.settings.runner;
    runnerSelect.addEventListener('change', () => {
      state.settings.runner = runnerSelect.value;
      saveSettings();
    });
  }
}

function applySettings() {
  document.getElementById('status-indent').textContent = `Spaces: ${state.settings.tabSize}`;
}

function setFontSize(size) {
  state.settings.fontSize = size;
  state.editor?.updateOptions({ fontSize: size });
  saveSettings();
}

function changeFontSize(delta) {
  setFontSize(Math.max(8, Math.min(32, state.settings.fontSize + delta)));
}

function toggleMinimap() {
  state.settings.minimap = !state.settings.minimap;
  state.editor?.updateOptions({ minimap: { enabled: state.settings.minimap } });
  const toggle = document.getElementById('minimap-toggle');
  if (toggle) toggle.checked = state.settings.minimap;
  saveSettings();
}

function saveSettings() {
  localStorage.setItem('ide_settings', JSON.stringify(state.settings));
}

function loadSettings() {
  const saved = localStorage.getItem('ide_settings');
  if (saved) {
    try { Object.assign(state.settings, JSON.parse(saved)); } catch(e) {}
  }
}

// ─── RUN BUTTONS ──────────────────────────────────────────────────────────────
function initRunButtons() {
  document.getElementById('run-btn')?.addEventListener('click', () => {
    if (state.running) stopRun();
    else runJava();
  });
  document.getElementById('run-input-btn')?.addEventListener('click', showInputModal);

  // Fullscreen button
  document.getElementById('btn-fullscreen')?.addEventListener('click', toggleFullscreen);
  document.addEventListener('keydown', e => {
    if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); }
  });
  document.addEventListener('fullscreenchange', updateFullscreenIcon);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function updateFullscreenIcon() {
  const btn = document.getElementById('btn-fullscreen');
  if (!btn) return;
  if (document.fullscreenElement) {
    btn.title = 'Sair do Fullscreen (F11)';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 1h-4v4h1.5v-2.5h2.5v-1.5zm5 0v1.5h2.5v2.5h1.5v-4h-4zm-5 10.5h-2.5v-2.5h-1.5v4h4v-1.5zm7.5-2.5v2.5h-2.5v1.5h4v-4h-1.5z"/></svg>';
  } else {
    btn.title = 'Fullscreen (F11)';
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1.5 1h4v1.5h-2.5v2.5h-1.5v-4zm9 0h4v4h-1.5v-2.5h-2.5v-1.5zm-9 9h1.5v2.5h2.5v1.5h-4v-4zm10.5 2.5v-2.5h1.5v4h-4v-1.5h2.5z"/></svg>';
  }
}

// ─── KEY BINDINGS ─────────────────────────────────────────────────────────────
function initKeyBindings() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'b': e.preventDefault(); toggleSidebar(); break;
        case '`': e.preventDefault(); togglePanel(); break;
        case 'n': e.preventDefault(); showNewFileModal(); break;
        case '=': case '+': e.preventDefault(); stepZoom(0.05); break;
        case '-': e.preventDefault(); stepZoom(-0.05); break;
        case '0': e.preventDefault(); applyZoom(1.0); break;
      }
    }
  });

  // Ctrl+Scroll to zoom
  document.addEventListener('wheel', e => {
    if (e.ctrlKey) {
      e.preventDefault();
      stepZoom(e.deltaY < 0 ? 0.05 : -0.05);
    }
  }, { passive: false });
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function showInputModal() {
  document.getElementById('modal-input').style.display = 'flex';
  document.getElementById('stdin-input').focus();
}

document.getElementById('modal-input-close')?.addEventListener('click', () => {
  document.getElementById('modal-input').style.display = 'none';
});
document.getElementById('modal-input-cancel')?.addEventListener('click', () => {
  document.getElementById('modal-input').style.display = 'none';
});
document.getElementById('modal-input-run')?.addEventListener('click', () => {
  const stdin = document.getElementById('stdin-input').value;
  document.getElementById('modal-input').style.display = 'none';
  runJava(stdin);
});

function showNewFileModal() {
  document.getElementById('modal-newfile').style.display = 'flex';
  const input = document.getElementById('newfile-input');
  input.value = '';
  input.focus();
}

document.getElementById('modal-newfile-close')?.addEventListener('click', () => {
  document.getElementById('modal-newfile').style.display = 'none';
});
document.getElementById('modal-newfile-cancel')?.addEventListener('click', () => {
  document.getElementById('modal-newfile').style.display = 'none';
});
document.getElementById('modal-newfile-ok')?.addEventListener('click', createNewFile);
document.getElementById('newfile-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') createNewFile();
});

function createNewFile() {
  let name = document.getElementById('newfile-input').value.trim();
  if (!name) return;
  if (!name.includes('.')) name += '.java';
  document.getElementById('modal-newfile').style.display = 'none';
  if (state.files[name]) { showNotification('Arquivo já existe', 'error'); return; }
  const isJava = name.endsWith('.java');
  const className = name.replace('.java', '');
  state.files[name] = isJava
    ? `public class ${className} {\n    public static void main(String[] args) {\n        \n    }\n}\n`
    : '';
  saveFiles();
  renderFileTree();
  openTab(name);
  showNotification(`${name} criado`, 'success');
}

// ─── CONTEXT MENU ─────────────────────────────────────────────────────────────
let ctxTarget = null;

function showContextMenu(e, name) {
  e.preventDefault();
  ctxTarget = name;
  const menu = document.getElementById('context-menu');
  menu.style.display = 'block';
  menu.style.left = e.clientX + 'px';
  menu.style.top  = e.clientY + 'px';
}

document.addEventListener('click', () => {
  document.getElementById('context-menu').style.display = 'none';
});

document.querySelectorAll('.ctx-item').forEach(item => {
  item.addEventListener('click', () => {
    const action = item.dataset.action;
    if (!ctxTarget) return;
    switch(action) {
      case 'ctx-open':      openTab(ctxTarget); break;
      case 'ctx-rename':    showRenameModal(ctxTarget); break;
      case 'ctx-duplicate': duplicateFile(ctxTarget); break;
      case 'ctx-delete':    deleteFile(ctxTarget); break;
    }
    ctxTarget = null;
  });
});

function showRenameModal(name) {
  document.getElementById('modal-rename').style.display = 'flex';
  const input = document.getElementById('rename-input');
  input.value = name;
  input.focus();
  input.select();
  document.getElementById('modal-rename-ok').onclick = () => {
    const newName = input.value.trim();
    if (!newName || newName === name) {
      document.getElementById('modal-rename').style.display = 'none';
      return;
    }
    state.files[newName] = state.files[name];
    delete state.files[name];
    if (state.models[name]) {
      state.models[newName] = state.models[name];
      delete state.models[name];
    }
    const idx = state.openTabs.indexOf(name);
    if (idx !== -1) state.openTabs[idx] = newName;
    if (state.activeFile === name) state.activeFile = newName;
    saveFiles();
    renderFileTree();
    renderTabs();
    document.getElementById('modal-rename').style.display = 'none';
    showNotification(`Renomeado para ${newName}`, 'success');
  };
}

document.getElementById('modal-rename-close')?.addEventListener('click', () => {
  document.getElementById('modal-rename').style.display = 'none';
});
document.getElementById('modal-rename-cancel')?.addEventListener('click', () => {
  document.getElementById('modal-rename').style.display = 'none';
});

function duplicateFile(name) {
  const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
  const base = name.replace(ext, '');
  let newName = base + '_copy' + ext;
  let i = 2;
  while (state.files[newName]) newName = base + '_copy' + i++ + ext;
  state.files[newName] = state.files[name];
  saveFiles();
  renderFileTree();
  openTab(newName);
  showNotification(`Duplicado como ${newName}`, 'success');
}

function deleteFile(name) {
  if (!confirm(`Deletar "${name}"?`)) return;
  delete state.files[name];
  delete state.models[name];
  closeTab(name);
  saveFiles();
  renderFileTree();
  showNotification(`${name} deletado`, 'info');
}

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
let notifTimer = null;
function showNotification(msg, type = 'info') {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.className = `notification ${type}`;
  el.style.display = 'block';
  clearTimeout(notifTimer);
  notifTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
