# Business Studio Technopark

AI-assisted customer feedback intelligence prototype built with TanStack Start, React, Vite, and Tailwind CSS. The app helps teams review customer sentiment, spot growing problem topics, inspect evidence, and compare possible cause hypotheses before deciding what to investigate next.

## Features

- Dashboard with period-based AI brief, KPI summaries, charts, and prioritized signals.
- Topic pages for negative growth, positive patterns, and topic-level drilldowns.
- Insight detail pages focused on problem evidence, alternative hypotheses, missing data, and investigation steps.
- Reviews, impact tracking, settings, loading skeletons, drawers, dialogs, and reusable UI primitives.

All domain data is currently mocked in `src/lib/mock/data.ts`; there are no live integrations yet.

## Tech Stack

- React 19 and TypeScript
- TanStack Start, TanStack Router, and TanStack Query
- Vite with `@lovable.dev/vite-tanstack-config`
- Tailwind CSS v4, shadcn-style Radix UI components, and lucide-react icons
- Recharts for data visualization
- Cloudflare/Wrangler-oriented production runtime

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build and preview the production bundle:

```sh
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` starts Vite locally.
- `npm run build` creates a production build.
- `npm run build:dev` builds in development mode.
- `npm run preview` serves the built app for local inspection.
- `npm run lint` runs ESLint and Prettier checks.
- `npm run format` formats files with Prettier.

## Project Structure

```text
src/
  routes/              file-based TanStack routes
  components/          shared application components
  components/ui/       shadcn/Radix UI primitives
  components/insight/  insight-detail feature components
  components/skeletons loading placeholders
  hooks/               reusable React hooks
  lib/                 utilities and mock data
  styles.css           global Tailwind styles
```

`src/routeTree.gen.ts` is generated from route files and should not be edited manually.

## Development Notes

Use the `@/` alias for imports from `src`. Keep page composition in route modules and move reusable UI into `src/components`. Formatting is controlled by Prettier: 100-character print width, semicolons, double quotes, and trailing commas.

No test runner is configured yet. Until one is added, validate changes with:

```sh
npm run lint
npm run build
```

## Deployment

The repository includes Cloudflare/Wrangler configuration in `wrangler.jsonc`. The Docker setup builds the app with Node 24 Alpine and serves the generated server bundle through Wrangler on port `8787`.

```sh
docker build -t business-studio-technopark .
docker run --rm -p 8787:8787 business-studio-technopark
```

The GitHub workflow, when present, builds and pushes an image to GHCR on `main`/`master` and triggers a deployment webhook.
