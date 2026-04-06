'use strict';

// ── CURRICULUM DATA ──────────────────────────────────────────────────────────
const MODULES = [
  {
    id: 'logica',
    title: 'Lógica de Programação',
    desc: 'Fundamentos antes do Java',
    icon: '🧠',
    color: '#1cb0f6',
    colorDark: '#0a8fc4',
    lessons: [
      {
        id: 'l1', icon: '🎯', title: 'O que é um Algoritmo?',
        xp: 10,
        desc: 'Um <b>algoritmo</b> é uma sequência de passos para resolver um problema. Pense em uma receita de bolo: cada instrução é um passo do algoritmo.',
        code: null,
        video: { label: 'Lógica de Programação — Bonieky', url: 'https://www.youtube.com/watch?v=epf-WQdVis0&t=10160s' }
      },
      {
        id: 'l2', icon: '🔢', title: 'Variáveis e Tipos',
        xp: 15,
        desc: 'Variáveis guardam valores. Em Java temos: <code>int</code> (inteiro), <code>double</code> (decimal), <code>String</code> (texto), <code>boolean</code> (verdadeiro/falso).',
        code: `<span class="kw">int</span> idade = <span class="num">18</span>;
<span class="kw">double</span> altura = <span class="num">1.75</span>;
<span class="kw">String</span> nome = <span class="str">"João"</span>;
<span class="kw">boolean</span> ativo = <span class="kw">true</span>;`,
        video: null
      },
      {
        id: 'l3', icon: '⚖️', title: 'Condicionais (if/else)',
        xp: 15,
        desc: 'O <code>if</code> executa um bloco <b>se</b> uma condição for verdadeira. O <code>else</code> executa quando a condição é falsa.',
        code: `<span class="kw">int</span> nota = <span class="num">7</span>;

<span class="kw">if</span> (nota >= <span class="num">6</span>) {
    <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Aprovado!"</span>);
} <span class="kw">else</span> {
    <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Reprovado."</span>);
}`,
        video: { label: 'Estruturas Condicionais', url: 'https://www.youtube.com/watch?v=1oEsU9k1n0M' }
      },
      {
        id: 'l4', icon: '🔄', title: 'Laços (for / while)',
        xp: 20,
        desc: 'Laços repetem um bloco de código. O <code>for</code> é ideal quando você sabe quantas vezes repetir. O <code>while</code> repete enquanto uma condição for verdadeira.',
        code: `<span class="cmt">// For: conta de 1 a 5</span>
<span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">1</span>; i <= <span class="num">5</span>; i++) {
    <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(i);
}

<span class="cmt">// While: enquanto menor que 3</span>
<span class="kw">int</span> x = <span class="num">0</span>;
<span class="kw">while</span> (x < <span class="num">3</span>) {
    x++;
}`,
        video: null
      },
      {
        id: 'l5', icon: '📦', title: 'Arrays',
        xp: 20,
        desc: 'Um <b>array</b> armazena múltiplos valores do mesmo tipo em sequência. Acesse pelo índice (começa em 0).',
        code: `<span class="kw">int</span>[] notas = {<span class="num">8</span>, <span class="num">7</span>, <span class="num">9</span>, <span class="num">6</span>};

<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(notas[<span class="num">0</span>]); <span class="cmt">// 8</span>
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(notas.<span class="fn">length</span>); <span class="cmt">// 4</span>`,
        video: null
      },
    ]
  },
  {
    id: 'java-basico',
    title: 'Java Básico',
    desc: 'Sua primeira classe Java',
    icon: '☕',
    color: '#ff9600',
    colorDark: '#cc7800',
    lessons: [
      {
        id: 'j1', icon: '👋', title: 'Hello World',
        xp: 10,
        desc: 'Todo programa Java começa com uma <b>classe</b>. O método <code>main</code> é o ponto de entrada — é por onde o programa começa a executar.',
        code: `<span class="kw">public class</span> <span class="cl">Main</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cl">String</span>[] args) {
        <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Hello, World!"</span>);
    }
}`,
        video: { label: 'Java Completo — DevDojo', url: 'https://www.youtube.com/watch?v=VKjFuX91G5Q&list=PL62G310vn6nFIsOCC0H-C2infYgwm8SWW' }
      },
      {
        id: 'j2', icon: '📥', title: 'Lendo Entrada (Scanner)',
        xp: 20,
        desc: 'Use <code>Scanner</code> para ler dados do usuário. Importe com <code>import java.util.Scanner;</code>.',
        code: `<span class="kw">import</span> java.util.<span class="cl">Scanner</span>;

<span class="kw">public class</span> <span class="cl">Main</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cl">String</span>[] args) {
        <span class="cl">Scanner</span> sc = <span class="kw">new</span> <span class="cl">Scanner</span>(<span class="cl">System</span>.in);
        <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">print</span>(<span class="str">"Seu nome: "</span>);
        <span class="cl">String</span> nome = sc.<span class="fn">nextLine</span>();
        <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Olá, "</span> + nome);
    }
}`,
        video: null
      },
      {
        id: 'j3', icon: '🔢', title: 'Operadores Matemáticos',
        xp: 15,
        desc: 'Java suporta <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code> e <code>%</code> (resto). Cuidado: divisão entre inteiros trunca o resultado!',
        code: `<span class="kw">int</span> a = <span class="num">10</span>, b = <span class="num">3</span>;

<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(a + b);  <span class="cmt">// 13</span>
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(a - b);  <span class="cmt">// 7</span>
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(a * b);  <span class="cmt">// 30</span>
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(a / b);  <span class="cmt">// 3 (inteiro!)</span>
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(a % b);  <span class="cmt">// 1 (resto)</span>`,
        video: null
      },
      {
        id: 'j4', icon: '🏆', title: 'Desafio: Soma de 5 números',
        xp: 30, checkpoint: false,
        desc: 'Leia 5 números inteiros e exiba a soma e a média. Use <code>Scanner</code> e um laço <code>for</code>.',
        code: `<span class="kw">import</span> java.util.<span class="cl">Scanner</span>;

<span class="kw">public class</span> <span class="cl">Soma</span> {
    <span class="kw">public static void</span> <span class="fn">main</span>(<span class="cl">String</span>[] args) {
        <span class="cl">Scanner</span> sc = <span class="kw">new</span> <span class="cl">Scanner</span>(<span class="cl">System</span>.in);
        <span class="kw">int</span> soma = <span class="num">0</span>;
        <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i < <span class="num">5</span>; i++) {
            soma += sc.<span class="fn">nextInt</span>();
        }
        <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Soma: "</span> + soma);
        <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Média: "</span> + (soma / <span class="num">5.0</span>));
    }
}`,
        video: null
      },
    ]
  },
  {
    id: 'java-oo',
    title: 'Orientação a Objetos',
    desc: 'Classes, objetos e herança',
    icon: '🏗️',
    color: '#ce82ff',
    colorDark: '#9b59b6',
    lessons: [
      {
        id: 'o1', icon: '📐', title: 'Classes e Objetos',
        xp: 25,
        desc: 'Uma <b>classe</b> é um molde. Um <b>objeto</b> é uma instância desse molde. Atributos são as características, métodos são os comportamentos.',
        code: `<span class="kw">public class</span> <span class="cl">Carro</span> {
    <span class="cl">String</span> marca;
    <span class="kw">int</span> ano;

    <span class="kw">void</span> <span class="fn">buzinar</span>() {
        <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Beep!"</span>);
    }
}

<span class="cmt">// Criando um objeto:</span>
<span class="cl">Carro</span> meuCarro = <span class="kw">new</span> <span class="cl">Carro</span>();
meuCarro.marca = <span class="str">"Toyota"</span>;
meuCarro.<span class="fn">buzinar</span>();`,
        video: { label: 'Java Roadmap Completo', url: 'https://www.youtube.com/watch?v=V5I11DRE-1M&t=3s' }
      },
      {
        id: 'o2', icon: '🔒', title: 'Encapsulamento',
        xp: 25,
        desc: 'Encapsulamento protege os dados com <code>private</code> e expõe via <b>getters/setters</b>. Isso evita que dados sejam alterados de forma indevida.',
        code: `<span class="kw">public class</span> <span class="cl">Pessoa</span> {
    <span class="kw">private</span> <span class="cl">String</span> nome;

    <span class="kw">public</span> <span class="cl">String</span> <span class="fn">getNome</span>() {
        <span class="kw">return</span> nome;
    }

    <span class="kw">public void</span> <span class="fn">setNome</span>(<span class="cl">String</span> n) {
        <span class="kw">this</span>.nome = n;
    }
}`,
        video: null
      },
      {
        id: 'o3', icon: '🧬', title: 'Herança',
        xp: 30,
        desc: 'Com <code>extends</code>, uma classe filha herda atributos e métodos da classe pai. Use <code>super</code> para acessar o construtor do pai.',
        code: `<span class="kw">public class</span> <span class="cl">Animal</span> {
    <span class="cl">String</span> nome;
    <span class="kw">void</span> <span class="fn">falar</span>() { <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"..."</span>); }
}

<span class="kw">public class</span> <span class="cl">Cachorro</span> <span class="kw">extends</span> <span class="cl">Animal</span> {
    <span class="kw">void</span> <span class="fn">falar</span>() { <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Au au!"</span>); }
}`,
        video: null
      },
      {
        id: 'o4', icon: '🎭', title: 'Polimorfismo',
        xp: 30,
        desc: 'Polimorfismo permite que objetos de classes diferentes respondam ao mesmo método de formas distintas.',
        code: `<span class="cl">Animal</span>[] animais = {
    <span class="kw">new</span> <span class="cl">Cachorro</span>(),
    <span class="kw">new</span> <span class="cl">Gato</span>()
};

<span class="kw">for</span> (<span class="cl">Animal</span> a : animais) {
    a.<span class="fn">falar</span>(); <span class="cmt">// cada um fala diferente</span>
}`,
        video: null
      },
      {
        id: 'o5', icon: '🏅', title: 'Checkpoint OO',
        xp: 50, checkpoint: true,
        desc: 'Crie uma classe <code>ContaBancaria</code> com saldo privado, métodos <code>depositar</code>, <code>sacar</code> e <code>getSaldo</code>. Teste no método main.',
        code: `<span class="kw">public class</span> <span class="cl">ContaBancaria</span> {
    <span class="kw">private double</span> saldo = <span class="num">0</span>;

    <span class="kw">public void</span> <span class="fn">depositar</span>(<span class="kw">double</span> v) { saldo += v; }

    <span class="kw">public void</span> <span class="fn">sacar</span>(<span class="kw">double</span> v) {
        <span class="kw">if</span> (v <= saldo) saldo -= v;
        <span class="kw">else</span> <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Saldo insuficiente"</span>);
    }

    <span class="kw">public double</span> <span class="fn">getSaldo</span>() { <span class="kw">return</span> saldo; }
}`,
        video: null
      },
    ]
  },
  {
    id: 'java-avancado',
    title: 'Java Avançado',
    desc: 'Collections, Streams e mais',
    icon: '🚀',
    color: '#58cc02',
    colorDark: '#46a302',
    lessons: [
      {
        id: 'a1', icon: '📋', title: 'ArrayList',
        xp: 25,
        desc: '<code>ArrayList</code> é uma lista dinâmica que cresce automaticamente. Muito mais flexível que arrays comuns.',
        code: `<span class="kw">import</span> java.util.<span class="cl">ArrayList</span>;

<span class="cl">ArrayList</span>&lt;<span class="cl">String</span>&gt; nomes = <span class="kw">new</span> <span class="cl">ArrayList</span>&lt;&gt;();
nomes.<span class="fn">add</span>(<span class="str">"Ana"</span>);
nomes.<span class="fn">add</span>(<span class="str">"Bruno"</span>);
nomes.<span class="fn">remove</span>(<span class="num">0</span>);
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(nomes.<span class="fn">size</span>()); <span class="cmt">// 1</span>`,
        video: null
      },
      {
        id: 'a2', icon: '🗺️', title: 'HashMap',
        xp: 25,
        desc: '<code>HashMap</code> armazena pares chave-valor. Ideal para buscas rápidas por chave.',
        code: `<span class="kw">import</span> java.util.<span class="cl">HashMap</span>;

<span class="cl">HashMap</span>&lt;<span class="cl">String</span>, <span class="cl">Integer</span>&gt; idades = <span class="kw">new</span> <span class="cl">HashMap</span>&lt;&gt;();
idades.<span class="fn">put</span>(<span class="str">"Ana"</span>, <span class="num">25</span>);
idades.<span class="fn">put</span>(<span class="str">"Bruno"</span>, <span class="num">30</span>);
<span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(idades.<span class="fn">get</span>(<span class="str">"Ana"</span>)); <span class="cmt">// 25</span>`,
        video: null
      },
      {
        id: 'a3', icon: '⚡', title: 'Streams e Lambda',
        xp: 35,
        desc: 'Streams permitem processar coleções de forma funcional e elegante com lambdas.',
        code: `<span class="kw">import</span> java.util.<span class="cl">List</span>;

<span class="cl">List</span>&lt;<span class="cl">Integer</span>&gt; nums = <span class="cl">List</span>.<span class="fn">of</span>(<span class="num">1</span>,<span class="num">2</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">5</span>);

nums.<span class="fn">stream</span>()
    .<span class="fn">filter</span>(n -> n % <span class="num">2</span> == <span class="num">0</span>)
    .<span class="fn">map</span>(n -> n * <span class="num">2</span>)
    .<span class="fn">forEach</span>(<span class="cl">System</span>.out::<span class="fn">println</span>);
<span class="cmt">// Saída: 4, 8</span>`,
        video: null
      },
      {
        id: 'a4', icon: '🛡️', title: 'Tratamento de Exceções',
        xp: 30,
        desc: 'Use <code>try/catch</code> para capturar erros em tempo de execução e evitar que o programa quebre.',
        code: `<span class="kw">try</span> {
    <span class="kw">int</span> resultado = <span class="num">10</span> / <span class="num">0</span>;
} <span class="kw">catch</span> (<span class="cl">ArithmeticException</span> e) {
    <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Erro: "</span> + e.<span class="fn">getMessage</span>());
} <span class="kw">finally</span> {
    <span class="cl">System</span>.<span class="fn">out</span>.<span class="fn">println</span>(<span class="str">"Sempre executa"</span>);
}`,
        video: null
      },
      {
        id: 'a5', icon: '🎓', title: 'Projeto Final',
        xp: 100, checkpoint: true,
        desc: 'Crie um sistema de cadastro de alunos usando <code>ArrayList</code>, com métodos para adicionar, remover e listar alunos. Use OO completo!',
        code: `<span class="kw">import</span> java.util.<span class="cl">ArrayList</span>;

<span class="kw">public class</span> <span class="cl">CadastroAlunos</span> {
    <span class="kw">private</span> <span class="cl">ArrayList</span>&lt;<span class="cl">String</span>&gt; alunos = <span class="kw">new</span> <span class="cl">ArrayList</span>&lt;&gt;();

    <span class="kw">public void</span> <span class="fn">adicionar</span>(<span class="cl">String</span> nome) { alunos.<span class="fn">add</span>(nome); }
    <span class="kw">public void</span> <span class="fn">remover</span>(<span class="cl">String</span> nome)  { alunos.<span class="fn">remove</span>(nome); }
    <span class="kw">public void</span> <span class="fn">listar</span>() { alunos.<span class="fn">forEach</span>(<span class="cl">System</span>.out::<span class="fn">println</span>); }
}`,
        video: null
      },
    ]
  }
];

const BADGE_DEFS = [
  { id: 'first',    icon: '🌟', label: 'Primeira lição!',   cond: s => s.done >= 1 },
  { id: 'five',     icon: '🔥', label: '5 lições!',         cond: s => s.done >= 5 },
  { id: 'ten',      icon: '💎', label: '10 lições!',        cond: s => s.done >= 10 },
  { id: 'all',      icon: '🏆', label: 'Trilha completa!',  cond: s => s.done >= s.total },
  { id: 'xp100',    icon: '⚡', label: '100 XP!',           cond: s => s.xp >= 100 },
  { id: 'xp500',    icon: '🚀', label: '500 XP!',           cond: s => s.xp >= 500 },
];

// ── STATE ────────────────────────────────────────────────────────────────────
const state = {
  completed: new Set(),
  xp: 0,
  streak: 0,
  lives: 5,
  earnedBadges: new Set(),
};

function saveState() {
  const data = {
    completed:    [...state.completed],
    xp:           state.xp,
    streak:       state.streak,
    lives:        state.lives,
    earnedBadges: [...state.earnedBadges],
  };
  localStorage.setItem('trilha_state', JSON.stringify(data));
  // Sync to Firebase if logged in
  if (window.JFAuth?.saveProfile) {
    JFAuth.saveProfile(data);
  }
}

function loadState() {
  // Try to load from JFAuth profile first, fallback to localStorage
  const profile = window.JFAuth?.profile;
  const source  = profile?.completed ? profile : null;
  const raw     = source || (() => {
    try { return JSON.parse(localStorage.getItem('trilha_state') || 'null'); } catch { return null; }
  })();

  if (!raw) return;
  state.completed    = new Set(raw.completed || []);
  state.xp           = raw.xp || 0;
  state.streak       = raw.streak || 0;
  state.lives        = raw.lives ?? 5;
  state.earnedBadges = new Set(raw.earnedBadges || []);
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function totalLessons() {
  return MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
}

function isUnlocked(moduleIdx, lessonIdx) {
  if (moduleIdx === 0 && lessonIdx === 0) return true;
  // Previous lesson must be done
  if (lessonIdx > 0) {
    const prev = MODULES[moduleIdx].lessons[lessonIdx - 1];
    return state.completed.has(prev.id);
  }
  // First lesson of module: last lesson of previous module must be done
  const prevModule = MODULES[moduleIdx - 1];
  if (!prevModule) return false;
  const lastLesson = prevModule.lessons[prevModule.lessons.length - 1];
  return state.completed.has(lastLesson.id);
}

function moduleProgress(module) {
  const done = module.lessons.filter(l => state.completed.has(l.id)).length;
  return { done, total: module.lessons.length, pct: Math.round(done / module.lessons.length * 100) };
}

// ── RENDER ───────────────────────────────────────────────────────────────────
function render() {
  renderTrail();
  renderSidebar();
  renderBadges();
  updateHeader();
}

function renderTrail() {
  const trail = document.getElementById('trail');
  trail.innerHTML = '';

  MODULES.forEach((module, mi) => {
    const block = document.createElement('div');
    block.className = 'module-block';
    block.id = 'module-' + module.id;

    const prog = moduleProgress(module);

    // Banner
    block.innerHTML = `
      <div class="module-banner" style="background:linear-gradient(135deg,${module.color},${module.colorDark})">
        <span class="module-banner-icon">${module.icon}</span>
        <div class="module-banner-info">
          <h2>${module.title}</h2>
          <p>${module.desc}</p>
        </div>
        <div class="module-banner-progress">${prog.done}/${prog.total} lições</div>
      </div>
    `;

    // Lesson nodes
    const nodesWrap = document.createElement('div');
    nodesWrap.className = 'lesson-nodes';

    module.lessons.forEach((lesson, li) => {
      const done    = state.completed.has(lesson.id);
      const unlocked = isUnlocked(mi, li);
      const isActive = unlocked && !done;

      // Connector line (except first)
      if (li > 0) {
        const conn = document.createElement('div');
        conn.className = 'lesson-connector' + (done ? ' done' : '');
        nodesWrap.appendChild(conn);
      }

      // Zigzag offset
      const offsets = [0, 60, 100, 60, 0, -60, -100, -60];
      const offset = offsets[li % offsets.length];

      const row = document.createElement('div');
      row.className = 'lesson-row';
      row.style.transform = `translateX(${offset}px)`;

      const stateClass = done ? 'done' : isActive ? 'active' : 'locked';
      const circleExtra = lesson.checkpoint ? ' checkpoint' : '';

      const stars = done ? '⭐⭐⭐' : '';

      row.innerHTML = `
        <button class="lesson-node" data-module="${mi}" data-lesson="${li}" ${!unlocked ? 'disabled' : ''}>
          <div class="node-circle ${stateClass}${circleExtra}">
            ${done ? '✓' : lesson.icon}
          </div>
          <div class="node-label">${lesson.title}</div>
          <div class="node-stars">${stars}</div>
        </button>
      `;

      nodesWrap.appendChild(row);
    });

    block.appendChild(nodesWrap);
    trail.appendChild(block);
  });

  // Attach click events
  document.querySelectorAll('.lesson-node:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      const mi = parseInt(btn.dataset.module);
      const li = parseInt(btn.dataset.lesson);
      openLesson(MODULES[mi].lessons[li]);
    });
  });
}

function renderSidebar() {
  const total = totalLessons();
  const done  = state.completed.size;
  const pct   = total > 0 ? Math.round(done / total * 100) : 0;

  // Ring
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById('ring-fill');
  if (ring) ring.style.strokeDashoffset = offset;
  const ringPct = document.getElementById('ring-pct');
  if (ringPct) ringPct.textContent = pct;

  document.getElementById('done-count').textContent  = done;
  document.getElementById('total-count').textContent = total;

  // Module nav
  const nav = document.getElementById('module-nav');
  nav.innerHTML = '';
  MODULES.forEach((m, mi) => {
    const prog = moduleProgress(m);
    const btn = document.createElement('button');
    btn.className = 'module-nav-item';
    btn.innerHTML = `
      <span class="module-nav-dot" style="background:${m.color}"></span>
      ${m.icon} ${m.title}
      <span style="margin-left:auto;font-size:0.75rem;color:${m.colorDark}">${prog.pct}%</span>
    `;
    btn.addEventListener('click', () => {
      document.getElementById('module-' + m.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    nav.appendChild(btn);
  });
}

function renderBadges() {
  const container = document.getElementById('badges');
  const stats = { done: state.completed.size, total: totalLessons(), xp: state.xp };

  container.innerHTML = '';
  BADGE_DEFS.forEach(b => {
    const earned = state.earnedBadges.has(b.id) || b.cond(stats);
    if (earned && !state.earnedBadges.has(b.id)) {
      state.earnedBadges.add(b.id);
      saveState();
    }
    const div = document.createElement('div');
    div.className = 'badge' + (earned ? ' earned' : '');
    div.innerHTML = `${b.icon}<span class="badge-tip">${b.label}</span>`;
    container.appendChild(div);
  });
}

function updateHeader() {
  document.getElementById('xp-val').textContent     = state.xp;
  document.getElementById('streak-val').textContent = state.streak;
  document.getElementById('lives-val').textContent  = state.lives;
}

// ── LESSON MODAL ─────────────────────────────────────────────────────────────
function openLesson(lesson) {
  const done = state.completed.has(lesson.id);
  const body = document.getElementById('modal-body');

  body.innerHTML = `
    <div class="lesson-modal-icon">${lesson.icon}</div>
    <div class="lesson-modal-title">${lesson.title}</div>
    <div class="lesson-modal-sub">+${lesson.xp} XP ${lesson.checkpoint ? '• 🏅 Checkpoint' : ''}</div>

    <div class="lesson-modal-desc">${lesson.desc}</div>

    ${lesson.code ? `<div class="lesson-code-block">${lesson.code}</div>` : ''}

    ${lesson.video ? `
      <a class="lesson-video-link" href="${lesson.video.url}" target="_blank" rel="noopener">
        <span class="yt-icon">▶</span>
        <span>Assistir: ${lesson.video.label}</span>
      </a>
    ` : ''}

    <div class="modal-actions">
      <button class="btn-complete ${done ? 'done-btn' : ''}" id="btn-complete">
        ${done ? '✓ Já concluída' : '✅ Marcar como concluída'}
      </button>
      <a class="btn-ide-modal" href="ide.html">💻 Praticar</a>
    </div>
  `;

  document.getElementById('btn-complete').addEventListener('click', () => {
    completeLesson(lesson);
  });

  document.getElementById('modal').style.display = 'flex';
}

function completeLesson(lesson) {
  if (state.completed.has(lesson.id)) return;

  state.completed.add(lesson.id);
  state.xp += lesson.xp;
  state.streak++;
  saveState();

  showXpToast('+' + lesson.xp + ' XP');
  document.getElementById('modal').style.display = 'none';
  render();
}

// ── XP TOAST ─────────────────────────────────────────────────────────────────
let toastTimer = null;
function showXpToast(msg) {
  const toast = document.getElementById('xp-toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();
  render();

  // Reload state when user logs in/out
  document.addEventListener('jf:authchange', ({ detail: { profile } }) => {
    if (profile?.completed) {
      state.completed    = new Set(profile.completed || []);
      state.xp           = profile.xp || 0;
      state.streak       = profile.streak || 0;
      state.lives        = profile.lives ?? 5;
      state.earnedBadges = new Set(profile.earnedBadges || []);
      render();
    }
  });

  // Close modal
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
  });
  document.getElementById('modal').addEventListener('click', e => {
    if (e.target === document.getElementById('modal')) {
      document.getElementById('modal').style.display = 'none';
    }
  });
});

// ── THEME ────────────────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('trilha_theme') || 'default';
  applyTheme(saved);

  const btn   = document.getElementById('btn-theme');
  const panel = document.getElementById('theme-panel');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    panel.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
    }
  });

  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.addEventListener('click', () => {
      applyTheme(opt.dataset.theme);
      panel.classList.remove('open');
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'default' ? '' : theme);
  localStorage.setItem('trilha_theme', theme);

  document.querySelectorAll('.theme-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.theme === theme);
  });
}
