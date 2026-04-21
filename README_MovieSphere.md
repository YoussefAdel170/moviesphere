# 🎬 MovieSphere

**MovieSphere** is a modern, full‑stack movie discovery platform.  
It combines data from **TMDB** with a **generative AI** (Groq) to deliver personalised movie recommendations.  
The project is actively evolving – current features include movie browsing, search, details, AI recommendations, voice search, dark/light mode, and basic i18n (English/Arabic).

🔗 **Live Demo:** *(coming soon)*

---

## ✨ Current Features

- 🔍 **Search & Pagination** – Find movies by title, browse through results.
- 🎭 **Movie Details** – View overview, budget, revenue, production companies, etc.
- 🤖 **AI‑Powered Recommendations** – Using Groq’s free LLM (`llama-3.1-8b-instant`) to suggest similar movies based on title, year, genres, and plot.
- 🎬 **TMDB Similar Movies** – Classic collaborative filtering recommendations.
- 🎙️ **Voice Search** – Speak your query (Web Speech API).
- 🌙 **Dark / Light Mode** – System preference + manual toggle.
- 🌍 **Internationalization (i18n)** – English & Arabic, with RTL layout for Arabic.
- 📱 **Responsive Design** – Works on desktop, tablet, and mobile.
- ⚡ **Basic Performance Optimisations** – Lazy loading images, React.memo on MovieCard.

---

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Redux Toolkit
- React Router DOM
- Vite
- Tailwind CSS + SCSS
- Framer Motion
- i18next

### Backend
- Node.js + Express
- Groq API

---

## 🚧 Planned Improvements
- Code splitting & lazy routes
- React Query caching
- Testing (Jest + RTL + E2E)
- React Native app
- Authentication system
- Watchlist & favorites
- Docker + CI/CD

---

## 🚀 Getting Started

### 1. Clone
```bash
git clone https://github.com/YoussefAdel170/moviesphere.git
cd moviesphere
```

### 2. Backend
```bash
cd moviesphere-backend
npm install
npm start
```

### 3. Frontend
```bash
cd moviesphere-frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
moviesphere/
├── moviesphere-backend/
├── moviesphere-frontend/
│   ├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── redux/
│   ├── services/
│   └── utils/
```
