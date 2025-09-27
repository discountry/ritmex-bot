# Repository Guidelines

## Project Structure & Module Organization
The Bun entry point (`index.ts`) lives at the repo root for quick CLI smoke checks. All production code is under `src/`:

- `src/strategy/` gathers every live trading engine (`maker`, `offset-maker`, `trend`). Shared helpers for strategy wiring sit in `src/strategy/common/`.
- `src/core/` keeps order coordination plus shared libs used by multiple strategies.
- `src/exchanges/` exposes the adapters and REST/websocket clients.
- `src/ui/` implements the Ink dashboards for each strategy (they remain independent dashboards).
- `src/logging/` contains the trade log helper.
- `src/utils/` and `src/config.ts` hold cross-cutting utilities and runtime config.
- `docs/` stores reference material, while `tests/` contains Vitest suites.

## Build, Test, and Development Commands
- `bun install` – install dependencies.
- `bun run index.ts` – launch the CLI menu.
- `bun x vitest run` – execute the full test suite; `bun x vitest --watch` for incremental runs.

Strategy-specific scripts still execute through the CLI; there is no separate `legacy/` workspace.

## Coding Style & Naming Conventions
Use modern TypeScript with ES modules, two-space indentation, and sorted imports (external → internal). Favor `camelCase` for variables/functions and `PascalCase` for classes/enums. Place new strategies under `src/strategy/`, shared utilities under `src/utils/` or `src/strategy/common/` when they only apply to strategies. Keep comments focused on non-obvious trading logic.

## Testing Guidelines
Vitest powers unit/integration tests. Co-locate new tests next to their subject using `<feature>.test.ts`. Strategies should have coverage for order lifecycle, risk guards, and websocket edge cases. Run `bun x vitest --watch` during development for fast feedback.

## Commit & Pull Request Guidelines
Follow lightweight Conventional Commits (e.g. `feat: add hedging status panel`). Scope each commit to a single module or strategy. PRs should include:
- Summary of changes.
- Validation notes (commands run, environments touched).
- Relevant logs or screenshots for behavior changes.
Link issues/tasks when available.

## Environment & Secrets
Duplicate `.env.example` to `.env` and populate API keys (Aster/GRVT) before running strategies. Do not commit secrets—use local `.env` or deployment secret managers. Rotate keys if they leak into logs or backups.
