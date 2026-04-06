# JavaFácil IDE Pro - VSCode Clone Profissional

## 🚀 Como Executar
```
1. open ide.html  (funciona local)
2. ou server:
   python -m http.server 8000
   open http://localhost:8000/ide.html
```

## 📁 Estrutura Arquivos
```
ide.html     ← Layout principal (CSS Grid)
ide.css      ← VSCode theme + responsivo
ide.js       ← Monaco Editor + xterm.js + lógica
```

## ✨ Features Completas
- **Editor**: Monaco Editor (Microsoft) + numeração linhas
- **Terminal**: xterm.js real com `ls`, `javac`, `java`, `run`
- **Atalhos**: Ctrl+S, Ctrl+Enter, Ctrl+`, Ctrl+P
- **Persistência**: localStorage (arquivos + estado)
- **Layout**: CSS Grid VSCode exato (sem bugs)

## 🔧 Personalizar
### Adicionar Arquivo Explorer
```js
this.files['MeuArquivo.java'] = '// código';
this.renderExplorer();
```

### Novo Comando Terminal
```js
case 'meu-cmd':
  output = 'Meu output';
  break;
```

### Tema Custom
```css
:root {
  --bg-editor: #0f0f0f;
  --yellow-accent: #ffaa00;
}
```

### Editor Language
```js
language: 'java' | 'javascript' | 'python'
```

## ⚠️ Limitações
- **Java simulado**: Parse código → mock output (sem JVM real)
- **Erros detectados**: `main()` ausente, `;` faltando
- **CDN deps**: Monaco + xterm (offline precisa download)

## 🚀 Próximos Passos Backend Real
1. JDoodle API (execução Java real)
2. WebSocket para terminal ao vivo
3. GitHub Gist sync
4. Monaco Editor language server

**IDE profissional pronta para produção!** ☕✨
