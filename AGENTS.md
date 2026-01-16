# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router routes, layouts, and page-level UI (e.g., `app/page.tsx`, `app/product/`, `app/api/`).
- `components/` holds reusable UI pieces organized by feature (`components/product/`, `components/cart/`, `components/layout/`).
- `lib/` is for shared utilities and data access (`lib/shopify/`, `lib/eversubs/`, `lib/storefront/`, `lib/utils.ts`, `lib/constants.ts`).
- `fonts/` stores local font assets. Global styles live in `app/globals.css`.

## Build, Test, and Development Commands
- `pnpm dev`: run the local dev server with Turbopack on `localhost:3000`.
- `pnpm build`: create the production build.
- `pnpm start`: start the production server from the build output.
- `pnpm test`: run formatting checks (see Testing Guidelines).
- `pnpm prettier` / `pnpm prettier:check`: format or verify formatting across the repo.
- `pnpm codegen:merchant` / `pnpm codegen:storefront`: regenerate OpenAPI client types under `lib/merchant/` and `lib/storefront/`.

## Coding Style & Naming Conventions
- Use TypeScript for all React components and utilities.
- Formatting is enforced by Prettier with `prettier-plugin-tailwindcss`; follow its output rather than manual alignment.
- Indentation: 2 spaces; quotes and trailing commas follow Prettier defaults.
- File naming uses lowercase kebab-case (e.g., `loading-dots.tsx`); React components use PascalCase.

## Testing Guidelines
- There is no unit test runner configured; `pnpm test` maps to `pnpm prettier:check` for style verification.
- If you add tests later, prefer colocating them near the feature (e.g., `components/product/__tests__/`).

## Commit & Pull Request Guidelines
- Recent commits follow Conventional Commits (e.g., `fix: ...`, `chore: ...`). Keep messages short and scoped.
- PRs should include a clear description of changes, linked issues when applicable, and screenshots for UI updates.

## Configuration & Secrets
- Environment variables are defined in `.env.example`; do not commit `.env` with secrets.
