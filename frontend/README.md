# 🔗 NEKLI

**Encurtador de URLs moderno, rápido e gratuito**

Transforme suas URLs longas em links curtos e elegantes com o NEKLI. Interface limpa, código aberto e fácil de usar.

---

## 🎯 Demonstração

```
URL Original: https://www.exemplo.com/pagina-muito-longa-com-parametros?id=123&ref=abc
URL Encurtada: https://nekli.com/abc123
```

**Teste agora:** [nekli.com](http://localhost:3000)

---


## ⚡ Características

- **🚀 Ultra Rápido** - Redirecionamento instantâneo
- **📱 Responsivo** - Funciona perfeitamente em mobile
- **🎨 Interface Limpa** - Design minimalista e intuitivo
- **📊 Estatísticas** - Monitore cliques em tempo real
- **🔒 Seguro** - Validação rigorosa de URLs
- **💯 Gratuito** - Código aberto, use à vontade
- **🌐 Sem Cadastro** - Encurte URLs instantaneamente

---

## 🛠️ Stack Tecnológico

| Tecnologia | Uso | Versão |
|------------|-----|---------|
| **React** | Frontend | 18+ |
| **Flask** | Backend API | 2.3+ |
| **Python** | Servidor | 3.8+ |
| **CSS3** | Estilização | - |
| **JavaScript** | Lógica Frontend | ES6+ |

---

## 🏃‍♂️ Execução Rápida

### 1️⃣ Clone e Configure
```bash
git clone https://github.com/seu-usuario/nekli.git
cd nekli
```

### 2️⃣ Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install flask flask-cors
python app.py
```
✅ **Backend rodando em:** `http://localhost:5000`

### 3️⃣ Frontend
```bash
cd frontend
npm install
npm start
```
✅ **Frontend rodando em:** `http://localhost:3000`

---

## 🗂️ Estrutura do Projeto

```
nekli/
├── 📁 backend/
│   ├── 🐍 app.py                    # API Flask
│   └── 📋 requirements.txt          # Dependências Python
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── 🌐 index.html
│   │   ├── 🤖 robots.txt
│   │   └── 📱 manifest.json
│   ├── 📁 src/
│   │   ├── 📁 services/
│   │   │   └── 🔌 api.js            # Serviços da API
│   │   ├── ⚛️ App.js                # Componente principal
│   │   ├── 🎨 App.css               # Estilos
│   │   └── 🖼️ logo.svg              # Logo NEKLI
│   └── 📦 package.json
└── 📖 README.md
```

## 🔌 API Reference

### `POST /api/shorten`
Encurta uma URL

```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
```

**Response:**
```json
{
  "original_url": "https://www.google.com",
  "short_url": "http://localhost:5000/abc123",
  "short_code": "abc123",
  "message": "URL encurtada com sucesso!"
}
```

### `GET /<code>`
Redireciona para URL original
```
http://localhost:5000/abc123 → https://www.google.com
```

### `GET /api/stats/<code>`
Estatísticas da URL
```json
{
  "original_url": "https://www.google.com",
  "clicks": 42,
  "created_at": "2025-08-11T10:30:00"
}
```

### Outros Endpoints
- `GET /api/health` - Status da API
- `GET /api/list` - Lista últimas URLs
- `GET /api/clear` - Limpar URLs (dev)

---

## 🤝 Contribuindo

Adoramos contribuições! 

---

## 📄 Licença

**MIT License** - Use, modifique e distribua livremente.

---

## 👨‍💻 Criador

**Desenvolvido com ❤️ por [Gabriela Oliveira](https://github.com/gabrielaferreiraa)**