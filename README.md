# DevPulse 🚀

> Real-time GitHub analytics for any developer. No login required.

![DevPulse Demo](./assets/demo.gif)

**[Live Demo](https://devpulse-xi.vercel.app/)** · **[API](https://devpulse-server-4xzk.onrender.com/api/health)**

---

## What it does

Paste any GitHub username and get an instant analytics dashboard — contribution heatmap, language breakdown, activity trends, top repositories, and a computed developer persona. No account needed.

Authenticated users (via GitHub OAuth) unlock private repo stats and a shareable PNG card.

---

## Features

- **Zero-friction search** — type any public username, dashboard loads instantly
- **Contribution heatmap** — 52 weeks of daily activity with hover tooltips
- **Language breakdown** — aggregated across all repos, not just one
- **Activity line chart** — weekly commit trends over the past year
- **Developer persona** — algorithm assigns a label (Consistent Grinder, Sprinter, Weekend Warrior, etc.) based on commit patterns
- **Side-by-side compare** — compare any two GitHub users
- **Shareable card** — auto-generated PNG with key stats (login required)
- **GitHub OAuth** — unlocks private repo data and higher API rate limits

---

## Tech Stack

**Frontend**
- React 18 + TypeScript (Vite)
- React Query (TanStack) — server state + caching
- Recharts — activity line chart + language donut
- react-calendar-heatmap — contribution heatmap
- React Router v6

**Backend**
- Node.js + Express + TypeScript
- GitHub REST API — profile and repo data
- GitHub GraphQL API — contribution calendar + language stats
- Redis (ioredis) — response caching with 1hr TTL
- node-canvas — server-side PNG card generation
- express-session — GitHub OAuth session management

**Infrastructure**
- Frontend: Vercel
- Backend: Render
- Redis: Render Redis

---

## Architecture

```
Browser
  │
  ├── React (Vercel)
  │     ├── React Query (client cache, 1hr stale time)
  │     └── Axios → Render backend
  │
  └── Render Backend (Express)
        ├── Check Redis cache (TTL: 1hr)
        │     ├── Hit  → return instantly
        │     └── Miss → fetch from GitHub API
        │
        ├── GitHub REST API  → profile, repos
        ├── GitHub GraphQL   → contributions, languages
        └── node-canvas      → PNG card generation
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Docker (for local Redis)

### Setup

```bash
# Clone
git clone https://github.com/sardarabhay/devpulse.git
cd devpulse

# Start Redis
docker run -d --name devpulse-redis -p 6379:6379 redis

# Backend
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev

# Frontend (new terminal)
cd client
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:5173`

### Environment Variables

**server/.env.example**
```
PORT=5000
GITHUB_TOKEN=           # GitHub Personal Access Token (read:user, repo)
GITHUB_CLIENT_ID=       # GitHub OAuth App Client ID
GITHUB_CLIENT_SECRET=   # GitHub OAuth App Client Secret
SESSION_SECRET=         # Any long random string
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
```

**client/.env.local**
```
VITE_API_BASE_URL=http://localhost:5000
```

---

## API Reference

```
GET /api/health                    Server health check
GET /api/user/:username            GitHub profile + top 6 repos
GET /api/stats/:username           Contributions + languages + persona
GET /api/compare/:user1/:user2     Side-by-side comparison
GET /api/card/:username            Shareable PNG card
GET /auth/github                   Start GitHub OAuth flow
GET /auth/me                       Current session user
POST /auth/logout                  Clear session
```

---

## Design Decisions

**Why manual OAuth instead of Passport.js?**
Being able to walk through every step of the OAuth flow — redirect, code exchange, token storage — shows understanding of the protocol, not just a library.

**Why Redis caching?**
GitHub's API rate limit is 5000 requests/hour. Without caching, a popular dashboard could hit that in minutes. Redis with a 1hr TTL keeps us well within limits and makes repeat visits instant.

**Why dual-access flow?**
Recruiters and hiring managers shouldn't need a GitHub account to evaluate the project. The public username search is zero-friction by design. OAuth is an optional upgrade, not a gate.

**Why node-canvas over Puppeteer?**
Puppeteer spins up a full Chromium instance — overkill for a card and a cold start killer. node-canvas draws directly on the server with no browser overhead.

---

## What I'd do with more time

- Add UptimeRobot keep-alive ping to prevent Render cold starts
- Switch from MemoryStore to Redis-backed sessions in production
- Add more persona types using hourly commit data (requires OAuth)
- Export dashboard as a full PDF report

---

## Author

**Abhay Sardar**

[GitHub](https://github.com/sardarabhay) · [LinkedIn](https://www.linkedin.com/in/abhay-sardar-26150b27a)