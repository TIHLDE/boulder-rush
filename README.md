# Boulder Rush

Push your boulder through a lane of obstacles, collect Databrus energy drinks, and race for the best score on the leaderboard. Supports single-player and 1v1 local multiplayer.

Built for ENT3R Inspirasjonskveld.

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
npm install
```

### Database

1. Set your PostgreSQL connection string in `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boulder_rush?schema=public"
```

2. Push the schema to your database:

```bash
npx prisma db push
```

3. Generate the Prisma client:

```bash
npx prisma generate
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Play

### Controls

- **Single Player / Player 1**: WASD
- **Player 2 (1v1)**: Arrow Keys

### Objective

Push your boulder from the start to the finish line as fast as possible. Collect Databrus cans along the way for bonus points.

### Scoring

- Base score is inversely tied to completion time (~8,500 for a 15s run)
- Each Databrus can adds 500 bonus points
- Maximum score: 9,999

### Characters

- **Abakule** (Red) — Hacker nerd with glasses
- **TIHLDEV** (Blue) — Sharp IT-consultant

### Modes

- **Single Player** — Solo run, chase the leaderboard
- **1v1 Local** — Best of 3 rounds, side-by-side lanes on same keyboard

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- HTML5 Canvas game engine
- Tailwind CSS
- PostgreSQL + Prisma 7
