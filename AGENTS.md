# Repository Guidelines

## Project Structure & Module Organization

This is a TanStack Start/Vite React application written in TypeScript. Application code lives under `src/`. File-based routes are in `src/routes/`; keep route modules focused on page composition and route metadata. Shared UI lives in `src/components/`, with shadcn/Radix primitives under `src/components/ui/`, page skeletons under `src/components/skeletons/`, and insight-specific components under `src/components/insight/`. Shared hooks belong in `src/hooks/`, utilities in `src/lib/`, mock data in `src/lib/mock/data.ts`, and global Tailwind CSS in `src/styles.css`.

Do not edit `src/routeTree.gen.ts` by hand; it is generated from the route files.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Vite dev server.
- `npm run build`: create the production build.
- `npm run build:dev`: build using development mode.
- `npm run preview`: preview the built app locally.
- `npm run lint`: run ESLint and Prettier checks.
- `npm run format`: format the repository with Prettier.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Component files use kebab-case filenames, while exported components use PascalCase, for example `kpi-card.tsx` exporting `KpiCard`. Prefer the `@/` alias for imports from `src/`. Keep utility helpers small and place class-name composition through `cn()` from `src/lib/utils.ts`.

Formatting is controlled by Prettier: 100-character print width, semicolons, double quotes, and trailing commas. ESLint uses TypeScript, React Hooks, React Refresh, and Prettier rules.

## Testing Guidelines

No test runner is currently configured. For now, validate changes with `npm run lint` and `npm run build`. When adding tests, place them near the code they cover using `*.test.ts` or `*.test.tsx`, and prefer React Testing Library/Vitest conventions unless the project adopts a different runner.

## Commit & Pull Request Guidelines

Recent history uses short, imperative summaries such as `Add skeleton loading states and animation polish` and `Fix guide modal motion transform`. Keep commits focused and descriptive; avoid placeholder messages like `Changes`.

Pull requests should include a brief description, screenshots or screen recordings for UI changes, linked issues when applicable, and the validation commands run locally. The GitHub workflow builds and pushes a Docker image on `main`/`master`, then calls a deployment webhook, so do not expose or hard-code deployment secrets.

## Agent-Specific Instructions

Respect the comment in `vite.config.ts`: `@lovable.dev/vite-tanstack-config` already provides React, TanStack, Tailwind, Cloudflare, env injection, and path-alias plugins. Add only incremental Vite configuration through `defineConfig({ vite: { ... } })`.
