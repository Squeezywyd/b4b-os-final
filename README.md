# Brick4Brick OS — Business Operating System

Full-stack internal business OS for brick4brick.ch — built with Next.js, TypeScript, and SQLite.

## Tech Stack
- Next.js 16 (App Router, TypeScript)
- SQLite via @libsql/client
- NextAuth.js v4 (bcrypt, JWT sessions)
- Custom CSS design system (Syne + DM Sans fonts, dark theme)

## Quick Start

1. npm install
2. cp .env.example .env.local  (then edit the secret)
3. npm run setup-db
4. npm run dev
5. Open http://localhost:3000/setup — use key: b4b-setup-2024
6. Login at http://localhost:3000/login

## Production
npm run build && npm start
