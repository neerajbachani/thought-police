# Thought Police

A Next.js web application that analyzes Reddit users’ comments and posts to surface ideological contradictions, provides contextual explanations, and ranks users on a public leaderboard. Built with Next, TypeScript, Tailwind CSS, Prisma, and integrates with the Reddit OAuth API and OpenRouter’s LLM endpoints for AI-driven summarization and contradiction detection.

---

## Table of Contents

1. [Features](#features)  
2. [Architecture](#architecture)  
3. [Folder Structure](#folder-structure)  
4. [Getting Started](#getting-started)  
   1. [Prerequisites](#prerequisites)  
   2. [Environment Variables](#environment-variables)  
   3. [Installation](#installation)  
   4. [Database Setup](#database-setup)  
   5. [Local Development](#local-development)  
   6. [Building and Production](#building-and-production)  
5. [Usage](#usage)  
6. [Key Modules](#key-modules)  
7. [Contributing](#contributing)  
8. [License](#license)

---

## Features

- Fetch and cache Reddit user comments & posts (up to 1 year back) via OAuth  
- Hierarchical AI-powered summarization (batch → meta-summary)  
- AI-driven contradiction detection with confidence scoring & categories  
- Local fallback heuristics when budget/API unavailable  
- Leaderboard, user profiles, and per-user stats (karma, account age, activity)  
- Streaming analysis for progressive UI updates  
- Token-budget management to control API usage & cost  
- Dark mode, responsive UI with Tailwind CSS & Framer Motion animations

---

## Architecture

- **Frontend**:  
  - Next.js App Router (`src/app/`)  
  - React components (`src/components/`)  
  - Tailwind CSS for styling  
  - Framer Motion for animations  

- **Backend (Server-Side)**:  
  - Next.js API routes (`src/app/api/`)  
  - `redditApi` service: paginated OAuth requests to Reddit’s API  
  - `multiModelPipeline` service: AI summarization & contradiction detection (OpenRouter)  
  - `analysisService` client: calls `/api/analyze`, wraps results for UI  
  - `tokenBudget` service: tracks and limits LLM token costs  
  - `cacheService`: caches analysis results to speed up repeat requests  

- **Database**:  
  - Prisma ORM (`prisma/schema.prisma`)  
  - Migrations stored in `prisma/migrations/`  
  - Stores users, analysis reports, and cached data (optional)

---

## Folder Structure

```
.
├── .next/                   # Next.js build artifacts
├── prisma/                  # Prisma schema & migrations
│   ├── migrations/
│   └── schema.prisma
├── public/                  # Static assets
│   └── thought-police-card.png
├── src/
│   ├── app/
│   │   ├── api/             # Next.js API routes
│   │   │   ├── analyze/route.ts
│   │   │   ├── reddit/…     # Reddit proxy routes
│   │   ├── leaderboard/     # Leaderboard page
│   │   ├── login/           # Login page
│   │   ├── profile/         # Profile page
│   │   ├── stats/           # Stats page
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # Reusable React components
│   │   ├── AnalysisResults.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Navigation.tsx
│   │   └── …  
│   ├── lib/
│   │   ├── services/
│   │   │   ├── redditApi.ts
│   │   │   ├── multiModelPipeline.ts
│   │   │   ├── analysisService.ts
│   │   │   ├── tokenBudget.ts
│   │   │   └── cacheService.ts
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   └── types/           # Shared TypeScript types
│   └── globals.css          # Global styles
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+  
- npm or Yarn  
- (Optional) A PostgreSQL or SQLite database for Prisma  

### Environment Variables

Create a `.env.local` in the project root with:

```ini
# .env.local
REDDIT_CLIENT_ID=<your_reddit_client_id>
REDDIT_CLIENT_SECRET=<your_reddit_client_secret>
OPENROUTER_API_KEY=<your_openrouter_api_key>
DATABASE_URL="postgresql://user:pass@localhost:5432/thought_police"  # or SQLite
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
git clone https://github.com/yourusername/thought-police.git
cd thought-police
npm install
```

### Database Setup

```bash
npx prisma migrate dev     # Create database schema
npx prisma generate        # Generate Prisma client
```

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building and Production

```bash
npm run build
npm start
```

---

## Usage

1. **Login** (if auth is enabled)  
2. **Enter a Reddit username** on the home page  
3. **Submit** to trigger analysis  
4. **View**:
   - Executive summary of contradictions  
   - Detailed contradiction cards (earlier vs. later statements, dates, subreddits, context)  
   - Overall stats, confidence scores, and quality indicators  
5. **Leaderboard** to compare top users by number of contradictions  

---

## Key Modules

- **redditApi.ts**  
  - OAuth 2.0 token fetching  
  - Paginated streaming of comments & posts with retry logic  

- **multiModelPipeline.ts**  
  - Deduplication & clustering of content  
  - Dynamic batching for summarization (7k+ token batches)  
  - Hierarchical meta-summarization for global context  
  - Contradiction detection with AI prompts  
  - Local fallback heuristics  

- **tokenBudget.ts**  
  - Tracks input/output token usage  
  - Enforces budget thresholds & warnings  
  - Persists usage in `localStorage`  

- **analysisService.ts**  
  - Client-side wrapper for `/api/analyze`  
  - Streaming analysis for progress UI  
  - Weighted confidence scoring  

- **cacheService.ts**  
  - Caches analysis reports by content hash  
  - Reduces duplicate API usage  

---

## Contributing

1. Fork the repository  
2. Create a feature branch: `git checkout -b feat/my-feature`  
3. Commit changes: `git commit -m "feat: add new feature"`  
4. Push branch: `git push origin feat/my-feature`  
5. Open a Pull Request  

Please run `npm test` (if tests exist) and follow code style conventions.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
