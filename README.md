# Mahmoud Salama — Interactive Portfolio

An interactive 2.5D portfolio concept built around a developer workspace instead of a traditional landing page.

## Experience

- Start outside the house and enter the workspace.
- Explore the room through interactive objects.
- Laptop: project case studies.
- Bookshelf: technical skills.
- Drawer: experience.
- Wall board: about.
- Phone: contact.
- Quick View: recruiter-friendly traditional portfolio view.

## Stack

- Next.js
- TypeScript
- React
- Motion
- CSS-driven 2.5D scene

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

## Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    portfolio-experience.tsx
  data/
    portfolio.ts
```

Portfolio content lives in `src/data/portfolio.ts` so project copy and personal details can be updated without touching the interactive scene.

## Current milestone

Milestone 1 focuses on validating the core interaction and visual language with one complete developer room before expanding into the rest of the house/world.
