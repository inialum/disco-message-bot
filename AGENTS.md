# AGENTS.md

## Project Overview

`inialum-disco-message-bot` is a Discord message bot for INIALUM built on Cloudflare Workers + Hono. Its core endpoint `POST /api/v1/messages/welcome` validates a request (Zod OpenAPI) and forwards a formatted "入会通知" embed to a Discord webhook. `/api/*` is protected by JWT auth. OpenAPI schema is served at `/schema/v1` and Swagger UI at `/docs/v1`.

Standard setup, dev, test, and token commands are documented in `README.md`; workspace scripts live in `package.json`. Prefer those sources instead of duplicating commands here.

## Cursor Cloud specific instructions

Non-obvious caveats for running this repo in the Cursor Cloud VM (dependencies are already installed by the startup update script):

- Toolchain: Node is pinned by `.node-version` / `devEngines.runtime` (24.11.1) and pnpm by `packageManager` / `devEngines.packageManager` in `package.json` (11.21.0). Running `pnpm` inside the repo auto-resolves to 11.21.0 (pnpm self-manages / corepack). A login shell can also resolve Node via `nvm`; non-login shells may fall back to a system Node 22, so prefer a login shell / `nvm use` if you hit version issues.
- Dev port: `pnpm run dev` starts `wrangler dev` on `:7071`. Run it under a long-lived tmux session, not a one-shot foreground command.
- Local vars (gitignored, required to run): copy `.dev.vars.example` to `.dev.vars` and fill: `ENVIRONMENT="local"`, `TOKEN_SECRET` (generate with `openssl rand -base64 32`), `DISCORD_WEBHOOK_URL`.
- Auth for API testing: `/api/*` requires a `Bearer` JWT signed with `TOKEN_SECRET`. Generate one with `pnpm run create-token` (reads `TOKEN_SECRET` from `.dev.vars`). Requests without it return 401; invalid bodies return 400.
- Webhook side effect: the welcome endpoint does a real `fetch(DISCORD_WEBHOOK_URL)`. Without a valid Discord webhook it returns 500. For local end-to-end verification, point `DISCORD_WEBHOOK_URL` at a local HTTP server that returns a 2xx (a 200/204 makes the endpoint return `{"status":"ok"}`).
- Lint/format: `pnpm lint` (`biome check`). Auto-fix: `pnpm fix`. Typecheck: `pnpm typecheck`. Tests: `pnpm test:ci` for a one-shot coverage run (`pnpm test` is watch mode).
- Worker bindings types are generated with `pnpm typegen` (`wrangler types --env-interface CloudflareBindings --strict-vars false`) into `worker-configuration.d.ts`. Re-run after Wrangler config changes.
