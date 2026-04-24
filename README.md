# Pulse — Live News Aggregator

A production-ready news aggregation website that pulls real-time RSS feeds across 8 categories. Zero paid APIs. Fully deployable in under 10 minutes.

**Live demo:** `https://your-app.vercel.app` (after deployment)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React + Vite + Tailwind)                      │
│  Deployed on Vercel                                     │
└────────────────────┬────────────────────────────────────┘
                     │ fetch /api/news
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Express API (Node.js)                                  │
│  Deployed on Render (free tier)                         │
│  • RSS parsing with rss-parser                          │
│  • 10-minute in-memory cache (NodeCache)                │
│  • Rate limiting, CORS, compression                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP fetch (RSS)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  35+ Free RSS Feeds                                     │
│  TechCrunch · BBC · Al Jazeera · NPR · Fox News         │
│  VentureBeat · Science Daily · Yahoo Finance · etc.     │
└─────────────────────────────────────────────────────────┘
```

---

## Features

- **8 categories:** AI, Technology, Science, Politics, Environment, Finance, Weather, World Affairs
- **Politics bias filter:** toggle Left / Center / Right sources independently
- **Trending keywords:** auto-extracted from current headlines
- **Search:** instant client-side filtering across all loaded articles
- **Bookmarks:** saved to localStorage, persist across sessions
- **Dark mode:** respects system preference, manually toggleable
- **Pagination:** 24 articles initially, "Load more" for rest
- **No duplicates:** URL-based deduplication across feeds
- **10-min cache:** prevents rate limiting, keeps API fast

---

## Local Development

### Prerequisites
- Node.js ≥ 18
- npm

### 1 — Clone & install

```bash
git clone <your-repo-url>
cd news-aggregator

# Install backend deps
cd backend && npm install

# Install frontend deps
cd ../frontend && npm install
```

### 2 — Run backend

```bash
cd backend
node src/server.js
# API available at http://localhost:3001
```

### 3 — Run frontend (new terminal)

```bash
cd frontend
npm run dev
# Opens http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:3001` automatically.

---

## Deployment (Free — Public URL in ~10 min)

### Step 1: Push to GitHub

```bash
cd news-aggregator
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/news-aggregator
git push -u origin main
```

### Step 2: Deploy Backend → Render

1. Go to **[render.com](https://render.com)** → Sign up / log in (GitHub works)
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Instance Type:** Free
5. Click **Create Web Service**
6. Wait ~2 min for deploy. Copy the URL, e.g. `https://news-aggregator-api.onrender.com`
7. Test: `https://news-aggregator-api.onrender.com/api/health` should return `{"status":"ok"}`

### Step 3: Deploy Frontend → Vercel

1. Go to **[vercel.com](https://vercel.com)** → Sign up / log in (GitHub works)
2. Click **Add New → Project**
3. Import your GitHub repo
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://news-aggregator-api.onrender.com` (your Render URL from Step 2)
6. Click **Deploy**
7. Your live URL appears — share it with anyone!

### Step 4: Set CORS on backend (optional but recommended)

In Render dashboard → your service → Environment:
- Add `FRONTEND_URL` = `https://your-app.vercel.app`

---

## Adding New RSS Sources

Edit `backend/src/feeds.js`. Each feed entry:

```js
{
  url: 'https://example.com/feed.rss',   // RSS/Atom URL
  sourceName: 'Example News',            // Display name
  category: CATEGORIES.TECHNOLOGY,      // One of the CATEGORIES constants
  bias: BIAS.CENTER,                     // Optional — only for Politics feeds
}
```

Categories: `AI`, `TECHNOLOGY`, `SCIENCE`, `POLITICS`, `ENVIRONMENT`, `FINANCE`, `WEATHER`, `WARS`

Bias values (politics only): `BIAS.LEFT`, `BIAS.CENTER`, `BIAS.RIGHT`

After editing, commit and push — Render auto-deploys.

---

## Source List

| Category | Sources |
|---|---|
| AI | VentureBeat AI, MIT Tech Review, The Verge AI, Ars Technica, OpenAI Blog |
| Technology | TechCrunch, Wired, The Verge, ZDNet, 9to5Mac |
| Science | Science Daily, Scientific American, NASA, New Scientist, Phys.org |
| Politics (Left) | CNN Politics, The Guardian, MSNBC |
| Politics (Center) | NPR Politics, NPR News, AP News, PBS NewsHour |
| Politics (Right) | Fox News Politics, Washington Times, New York Post |
| Finance | Yahoo Finance, MarketWatch, Investing.com |
| Environment | Inside Climate News, Science Daily Earth, Yale E360, Guardian Environment |
| Weather | AccuWeather, NOAA Alerts |
| World Affairs | BBC World, Al Jazeera, Reuters World, Deutsche Welle |

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Backend | Node.js 18+, Express 4, rss-parser, node-cache |
| Hosting (frontend) | Vercel (free) |
| Hosting (backend) | Render (free) |
| Data | 35+ free RSS feeds |
