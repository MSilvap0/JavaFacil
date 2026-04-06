/**
 * JavaFácil - Script Principal
 * Funcionalidades: 
 * - Menu mobile
 * - Scroll suave
 * - Animações ao rolar
 * - Busca e filtro de conteúdo
 * - FAQ accordion
 * - Back to top
 * - Copiar código
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
  animationObserver: {
    threshold: 0.1,
    rootMargin: '0px 0px -10% 0px'
  },
  debounceDelay: 300
};

// ===== MENU MOBILE =====
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });
}

// ===== SCROLL SUAVE =====
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Fechar menu mobile ao clicar em link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.background = 'rgba(255, 255, 255, 0.98)';
    header.style.boxShadow = '0 10px 30px rgb(0 0 0 / 0.1)';
  } else {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
  }
});

// ===== ANIMAÇÕES AO ROLAR (Intersection Observer) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
    }
  });
}, CONFIG.animationObserver);

// Observar todos os elementos com animação
document.querySelectorAll('.animate-slide').forEach(el => {
  observer.observe(el);
});

// ===== BACK TO TOP =====
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', throttle(() => {
  if (window.scrollY > 500) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}, 100));

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== BUSCA E FILTRO =====
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const contentCards = document.querySelectorAll('.video-card, .exercicio-card, .logica-item');

// Filtros por categoria
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remover classe active de todos
    filterBtns.forEach(b => b.classList.remove('active'));
    // Ativar clicado
    btn.classList.add('active');
    
    const filtro = btn.dataset.filtro;
    filterContent(filtro, '');
  });
});

// Busca por texto
searchInput?.addEventListener('input', debounce((e) => {
  const termo = e.target.value.toLowerCase().trim();
  const filtroAtivo = document.querySelector('.filter-btn.active')?.dataset.filtro || 'todos';
  filterContent(filtroAtivo, termo);
}, CONFIG.debounceDelay));

function filterContent(categoria, termo) {
  contentCards.forEach(card => {
    const cardCategoria = card.dataset.categoria || 'todos';
    const cardTexto = card.dataset.texto || card.textContent.toLowerCase();
    
    const matchesCategoria = categoria === 'todos' || cardCategoria === categoria;
    const matchesTexto = !termo || cardTexto.includes(termo);
    
    if (matchesCategoria && matchesTexto) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = null;
      }, 10);
    } else {
      card.classList.add('hidden');
    }
  });
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const faqItem = question.closest('.faq-item');
    const isOpen = faqItem.hasAttribute('open');
    
    // Fechar todos os outros
    document.querySelectorAll('.faq-item').forEach(item => {
      item.removeAttribute('open');
      item.classList.remove('open');
    });
    
    // Abrir/Fechar atual
    if (!isOpen) {
      faqItem.setAttribute('open', '');
      faqItem.classList.add('open');
    }
  });

  // Teclado
  question.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      question.click();
    }
  });
});

// ===== EXERCÍCIOS - COPIAR CÓDIGO =====
const codigos = {
  soma: `import java.util.Scanner;

public class SomaNumeros {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int soma = 0;
        
        for(int i = 1; i <= 5; i++) {
            System.out.print("Digite o " + i + "º número: ");
            soma += scanner.nextInt();
        }
        
        System.out.println("Soma: " + soma);
        System.out.println("Média: " + (soma / 5.0));
        scanner.close();
    }
}`,
  
  tabuada: `public class Tabuada {
    public static void main(String[] args) {
        for(int i = 1; i <= 10; i++) {
            for(int j = 1; j <= 10; j++) {
                System.out.printf("%2d x %2d = %3d%n", i, j, i*j);
            }
            System.out.println("---");
        }
    }
}`,
  
  maior: `import java.util.Scanner;

public class MaiorNumero {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Digite 3 números: ");
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = scanner.nextInt();
        
        int maior = a;
        if(b > maior) maior = b;
        if(c > maior) maior = c;
        
        System.out.println("Maior número: " + maior);
        scanner.close();
    }
}`
};

function copiarCodigo(nome) {
  const codigo = codigos[nome];
  navigator.clipboard.writeText(codigo).then(() => {
    // Feedback visual
    const btn = event.target;
    const textoOriginal = btn.textContent;
    btn.textContent = '✅ Copiado!';
    btn.style.background = '#10B981';
    
    setTimeout(() => {
      btn.textContent = textoOriginal;
      btn.style.background = '';
    }, 2000);
  }).catch(() => {
    alert('Falha ao copiar. Selecione manualmente o código.');
  });
}

// ===== UTILITÁRIOS =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Função IDE - Executar código (simulação)
function runCode() {
  const editor = document.getElementById('codeEditor');
  const output = document.getElementById('codeOutput');
  const code = editor.value.trim();
  
  if (!code) {
    output.textContent = 'Erro: Digite um código Java válido!';
    output.style.color = '#ff6b6b';
    return;
  }
  
  // Simular compilação (em produção: usar API como JDoodle/Repl.it)
  output.textContent = `Compilando...
Executando código...

--- SAÍDA ---
${simulateJavaOutput(code)}

--- TEMPO: 0.8s ---`;
  output.style.color = '#c9d1d9';
}

// Simulação de saída Java (para demo)
function simulateJavaOutput(code) {
  if (code.includes('System.out.println')) {
    return 'Hello World! (Seu código compilou com sucesso)\nPrograma executado perfeitamente!';
  }
  if (code.includes('soma') || code.includes('Scanner')) {
    return '5\n3\n8\n2\n7\nSoma: 25\nMédia: 5.0';
  }
  return 'Seu programa rodou com sucesso!\nVer console para resultados.';
}

// Sistema de arquivos localStorage (VSCode-like)
const FILE_STORAGE = 'javafacil_files';
let currentFile = 'Main.java';

function loadFiles() {
  const files = JSON.parse(localStorage.getItem(FILE_STORAGE) || '{}');
  return files;
}

function saveFile(name, content) {
  const files = loadFiles();
  files[name] = content;
  localStorage.setItem(FILE_STORAGE, JSON.stringify(files));
}

function listFiles() {
  return Object.keys(loadFiles());
}

function loadCurrentFile() {
  const files = loadFiles();
  const content = files[currentFile] || '// Novo arquivo Java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}';
  document.getElementById('codeEditor').value = content;
}

// Auto-save
document.getElementById('codeEditor')?.addEventListener('input', debounce(() => {
  saveFile(currentFile, document.getElementById('codeEditor').value);
}, 500));

// ===== ABAS LIÇÕES =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;
    
    // Ativar aba
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    
    btn.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});

// Lições - Problemas e Soluções
const problemas = {
  soma: {
    desc: 'Receba 5 números e mostre soma + média',
    solucao: `import java.util.Scanner;

public class SomaNumeros {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int soma = 0;
        
        for(int i = 1; i <= 5; i++) {
            System.out.print("Digite o " + i + "º número: ");
            soma += scanner.nextInt();
        }
        
        System.out.println("Soma: " + soma);
        System.out.println("Média: " + (soma / 5.0));
        scanner.close();
    }
}`
  },
  tabuada: {
    desc: 'Mostre tabuada de 1 a 10 formatada',
    solucao: `public class Tabuada {
    public static void main(String[] args) {
        for(int i = 1; i <= 10; i++) {
            System.out.printf("%2d: ", i);
            for(int j = 1; j <= 10; j++) {
                System.out.printf("%4d", i*j);
            }
            System.out.println();
        }
    }
}`
  },
  maior: {
    desc: 'Encontre maior de 3 números',
    solucao: `import java.util.Scanner;

public class MaiorNumero {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Digite 3 números: ");
        int a = scanner.nextInt(), b = scanner.nextInt(), c = scanner.nextInt();
        
        int maior = a > b ? a : b;
        maior = maior > c ? maior : c;
        
        System.out.println("Maior: " + maior);
        scanner.close();
    }
}`
  }
};

function loadProblem(nome) {
  const problema = problemas[nome];
  document.querySelector('.tab-btn[data-tab="solucoes"]').click();
  document.getElementById('codigoSolucao').textContent = problema.solucao;
}

function copiarSolucaoAtual() {
  const codigo = document.getElementById('codigoSolucao').textContent;
  navigator.clipboard.writeText(codigo).then(() => {
    const btn = event.target;
    const original = btn.textContent;
    btn.textContent = '✅ Copiado!';
    setTimeout(() => btn.textContent = original, 1500);
  });
}

function loadToIDE() {
  const codigo = document.getElementById('codigoSolucao').textContent;
  const editor = document.getElementById('codeEditor');
  editor.value = codigo;
  scrollToSection('ide');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 JavaFácil + Lições carregado!');
  
  loadCurrentFile();
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Syntax highlighting + autocomplete
  const editor = document.getElementById('codeEditor');
  if (editor) {
    editor.addEventListener('input', highlightSyntax);
  }
});

function highlightSyntax() {
  const editor = document.getElementById('codeEditor');
  if (editor) {
    const cursorPos = editor.selectionStart;
    const text = editor.value;
    
    // Auto-complete parênteses
    if (text[cursorPos - 1] === '(') {
      const newText = text.slice(0, cursorPos) + ')' + text.slice(cursorPos);
      editor.value = newText;
      editor.setSelectionRange(cursorPos + 1, cursorPos + 1);
    } else if (text[cursorPos - 1] === '{') {
      const newText = text.slice(0, cursorPos) + '}' + text.slice(cursorPos);
      editor.value = newText;
      editor.setSelectionRange(cursorPos + 1, cursorPos + 1);
    } else if (text[cursorPos - 1] === '[') {
      const newText = text.slice(0, cursorPos) + ']' + text.slice(cursorPos);
      editor.value = newText;
      editor.setSelectionRange(cursorPos + 1, cursorPos + 1);
    } else if (text[cursorPos - 1] === '"') {
      const newText = text.slice(0, cursorPos) + '"' + text.slice(cursorPos);
      editor.value = newText;
      editor.setSelectionRange(cursorPos, cursorPos);
    }
    
    editor.style.background = 'linear-gradient(180deg, #1e1e1e 0%, #0d1117 100%)';
  }
}

// PWA Ready (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// ========================================
// JAVAFÁCIL IDE - VSCode Clone Functionality
// ========================================

// IDE Storage Keys
const IDE_STORAGE = {
  files: 'javafacil_ide_files',
  activeFile: 'javafacil_ide_activeFile',
  theme: 'javafacil_ide_theme',
  terminalHistory: 'javafacil_ide_termHistory'
};

// Default Java files
const DEFAULT_FILES = {
  'Main.java': `public class Main {
  public static void main(String[] args) {
      System.out.println("Hello JavaFácil IDE!");
      System.out.println("☕ Compilou perfeitamente!");
  }
}`,
  'Test.java': `import java.util.Scanner;

public class Test {
  public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      System.out.print("Digite um número: ");
      int n = sc.nextInt();
      System.out.println("Você digitou: " + n);
      sc.close();
  }
}`,
  'Ex1_Soma.java': `public class Ex1_Soma {
  public static void main(String[] args) {
      int soma = 0;
      for(int i=1; i<=5; i++) {
          soma += i;
      }
      System.out.println("Soma 1-5: " + soma);  // 15
  }
}`
};

let IDEcurrentFile = localStorage.getItem(IDE_STORAGE.activeFile) || 'Main.java';
let IDElineCount = 1, IDEcursorLine = 1, IDEcursorCol = 1;

// ===== IDE INIT =====
function initIDE() {
  // Detect if on IDE page
  if (!document.querySelector('.ide-body')) return;
  
  console.log('🚀 JavaFácil IDE iniciada!');
  
  setupEditor();
  setupTabs();
  setupSidebar();
  setupTerminal();
  setupShortcuts();
  setupLineNumbers();
  loadFiles();
  updateStatusBar();
  
  // Load current file
  loadFile(currentFile);
  
  // Preload default files if empty
  if (Object.keys(loadFiles()).length === 0) {
    Object.entries(DEFAULT_FILES).forEach(([name, content]) => saveFile(name, content));
    updateFileTree();
  }
}

// ===== FILE SYSTEM =====
function loadFiles() {
  return JSON.parse(localStorage.getItem(IDE_STORAGE.files) || '{}');
}

function saveFile(name, content) {
  const files = loadFiles();
  files[name] = content;
  localStorage.setItem(IDE_STORAGE.files, JSON.stringify(files));
  if (currentFile === name) {
    tokenizeSyntax();
    updateLineNumbers();
  }
}

function loadFile(name) {
  const files = loadFiles();
  const content = files[name] || '// Novo arquivo Java\npublic class Main {\n    public static void main(String[] args) {\n        // Escreva seu código aqui!\n    }\n}\n';
  document.getElementById('code-editor').value = content;
IDEcurrentFile = name;
  localStorage.setItem(IDE_STORAGE.activeFile, name);
  document.querySelector('.project-file').textContent = `☕ /src/${name} ●`;
  
  // Update tabs
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  const activeTab = Array.from(document.querySelectorAll('.tab')).find(t => t.dataset.file === name);
  if (activeTab) activeTab.classList.add('active');
  
  tokenizeSyntax();
  updateLineNumbers();
}

function createFile(name) {
  saveFile(name, '// Novo arquivo\n');
  updateFileTree();
  updateTabs();
}

function deleteFile(name) {
  const files = loadFiles();
  delete files[name];
  localStorage.setItem(IDE_STORAGE.files, JSON.stringify(files));
  if (currentFile === name) {
    currentFile = Object.keys(files)[0] || 'Main.java';
    loadFile(currentFile);
  }
  updateFileTree();
  updateTabs();
}

// ===== EDITOR =====
function setupEditor() {
  const editor = document.getElementById('code-editor');
  const gutter = document.querySelector('.editor-gutter');
  
  editor.addEventListener('input', () => {
    saveFile(currentFile, editor.value);
    updateLineNumbers();
    tokenizeSyntax();
    updateStatusBar();
  });
  
  editor.addEventListener('scroll', syncGutterScroll);
  
  // Cursor position
  editor.addEventListener('keydown', updateCursorPosition);
  editor.addEventListener('keyup', updateCursorPosition);
  
  function syncGutterScroll() {
    gutter.scrollTop = editor.scrollTop;
  }
  
  function updateCursorPosition() {
    const pos = editor.selectionEnd;
    const lines = editor.value.slice(0, pos).split('\n');
    cursorLine = lines.length;
    cursorCol = lines[lines.length-1].length + 1;
    updateStatusBar();
  }
}

function updateLineNumbers() {
  const editor = document.getElementById('code-editor');
  const lines = editor.value.split('\n').length;
  let gutterHTML = '';
  for (let i = 1; i <= lines; i++) {
    gutterHTML += i + '\n';
  }
  document.querySelector('.editor-gutter').textContent = gutterHTML;
}

function tokenizeSyntax() {
  const editor = document.getElementById('code-editor');
  let code = editor.value;
  
  // Java keywords
  const keywords = ['public', 'static', 'void', 'class', 'int', 'String', 'System', 'out', 'main', 'args', 'if', 'else', 'for', 'while'];
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    code = code.replace(regex, `<span class="token-keyword">$&</span>`);
  });
  
  // Strings
  code = code.replace(/"([^"]*)"/g, '"<span class="token-string">$1</span>"');
  
  // Comments
  code = code.replace(/\/\/.*$/gm, '<span class="token-comment">$&</span>');
  code = code.replace(/\/\*[\s\S]*?\*\//g, '<span class="token-comment">$&</span>');
  
  editor.innerHTML = code.replace(/\n/g, '<br>');
}

// ===== TABS & SIDEBAR =====
function setupTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadFile(tab.dataset.file);
    });
  });
}

function setupSidebar() {
  // Activity bar
  document.querySelectorAll('.activity-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.activity-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
      document.querySelector(`[data-panel="${item.dataset.panel}"]`).classList.add('active');
    });
  });
  
  // File tree
  document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('click', () => {
      loadFile(item.dataset.file);
      document.querySelectorAll('.file-item').forEach(f => f.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function updateFileTree() {
  const files = loadFiles();
  const tree = document.querySelector('.file-tree');
  tree.innerHTML = '';
  Object.keys(files).forEach(name => {
    const div = document.createElement('div');
    div.className = 'file-item';
    div.dataset.file = name;
    div.textContent = '📄 ' + name;
    if (name === currentFile) div.classList.add('active');
    div.addEventListener('click', () => loadFile(name));
    tree.appendChild(div);
  });
}

function updateTabs() {
  const files = loadFiles();
  const tabsContainer = document.querySelector('.editor-tabs');
  tabsContainer.innerHTML = '';
  Object.keys(files).forEach(name => {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.dataset.file = name;
    tab.textContent = name;
    if (name === currentFile) tab.classList.add('active');
    tab.addEventListener('click', () => loadFile(name));
    tabsContainer.appendChild(tab);
  });
}

// ===== TERMINAL =====
function setupTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        processTerminalCommand(cmd);
        input.value = '';
      }
    }
  });
}

const TERMINAL_COMMANDS = {
  'help': () => 'Comandos: help, clear, ls, cat [file], javac [file], java [class], exit',
  'clear': () => { document.getElementById('terminal-output').innerHTML = ''; return ''; },
  'ls': () => Object.keys(loadFiles()).join(' '),
  'cat': (args) => {
    const file = args[1];
    if (file && loadFiles()[file]) return loadFiles()[file].substring(0, 500);
    return 'Arquivo não encontrado';
  },
  'javac': (args) => {
    const file = args[1];
    if (!file) return 'Uso: javac Main.java';
    const code = loadFiles()[file];
    if (!code) return 'Arquivo não encontrado';
    const errors = checkJavaSyntax(code);
    return errors.length ? `Erros (${errors.length}):\n${errors.join('\n')}` : 'Compilado com sucesso!';
  },
  'java': (args) => {
    const cls = args[1];
    if (!cls) return 'Uso: java Main';
    const code = loadFiles()[cls.replace('.java', '') + '.java'] || '';
    return simulateJavaExecution(code);
  }
};

function processTerminalCommand(cmd) {
  const output = document.getElementById('terminal-output');
  const [command, ...args] = cmd.split(' ');
  const result = TERMINAL_COMMANDS[command]?.(args) || `Comando '${command}' não encontrado. Digite 'help'`;
  
  output.innerHTML += `<span class="prompt">$</span>${escapeHtml(cmd)}<br>${escapeHtml(result)}<br><br>`;
  output.scrollTop = output.scrollHeight;
}

function checkJavaSyntax(code) {
  const errors = [];
  if (!/public\s+class/.test(code)) errors.push('ERRO: Falta "public class Nome"');
  if (!/public static void main/.test(code)) errors.push('ERRO: Falta método main()');
  if (!code.includes(';')) errors.push('ERRO: Linha sem ; (ponto e vírgula)');
  return errors;
}

function simulateJavaExecution(code) {
  if (code.includes('System.out.println')) {
    return 'Hello World!\\n☕ Programa executado com sucesso!';
  }
  if (code.includes('Scanner')) {
    return 'Input: 42\\nVocê digitou: 42';
  }
  if (code.includes('soma') || code.includes('for')) {
    return 'Soma 1-5: 15\\nMédia: 3.0';
  }
  return 'Programa executado! (output simulado)';
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '<', '>': '>' };
  return text.replace(/[&<]/g, m => map[m]);
}

// ===== SHORTCUTS =====
function setupShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          document.querySelector('.topbar-btn[title*="Salvar"]').click(); // Save
          break;
        case 'enter':
          if (e.shiftKey) break; // Allow shift+enter
          e.preventDefault();
          document.querySelector('.run-btn').click(); // Run
          break;
        case '`':
          e.preventDefault();
          toggleTerminal();
          break;
        case 'p':
          e.preventDefault();
          quickOpen();
          break;
      }
    }
  });
}

function toggleTerminal() {
  const panelsContainer = document.querySelector('.panels-container');
  panelsContainer.style.display = panelsContainer.style.display === 'none' ? 'flex' : 'none';
}

function quickOpen() {
  const files = Object.keys(loadFiles());
  const fileList = files.map(f => `📄 ${f}`).join('\\n');
  prompt('Ctrl+P Quick Open:\\n' + fileList) || '';
}

// ===== STATUS BAR =====
function updateStatusBar() {
  document.querySelector('.status-left').textContent = `Ln ${cursorLine}, Col ${cursorCol}`;
}

// ===== EVENT BUTTONS =====
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('run-btn')) {
    runCodeFromEditor();
  }
});

function runCodeFromEditor() {
  const code = document.getElementById('code-editor').value;
  const output = document.getElementById('output-content');
  const problems = document.querySelector('.problems-list');
  
  // Show output
  output.textContent = `▶ Executando ${currentFile}...\n\n${simulateJavaExecution(code)}`;
  
  // Check problems
  const errors = checkJavaSyntax(code);
  problems.innerHTML = errors.map(err => 
    `<li class="problem-item problem-error">${err}</li>`
  ).join('');
  
  // Switch to output tab
  document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('[data-panel="output"]').classList.add('active');
  document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
  document.getElementById('output').classList.add('active');
}

// ===== INIT CALL =====
document.addEventListener('DOMContentLoaded', initIDE);
