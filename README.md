# PRD Generator & Agreement Builder

AI-assisted product requirement document (PRD) generation and agreement building with export, translation, and document customization.

## Tech Stack

- Next.js 15 + React 19
- TypeScript
- Tailwind CSS v4
- Gemini API via Next.js API routes
- Export: DOCX, high-fidelity PDF, JSPDF-based summary

## Getting Started

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set required API keys:
   ```bash
   cp .env.example .env.local
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run clean` — clean Next.js build cache

## Features

- AI-generated and refined PRD content
- Quick-fill and auto-complete assistance
- DOCX and PDF export workflows
- Print preview and PDF styling controls
- Document branding and translation
- Saved documents and version history
- Insights dashboard
- Workflow stepper, minimap, and interactive forms

## Notes

- This project is private.
- Configure API keys in `.env.local` before running AI features.
