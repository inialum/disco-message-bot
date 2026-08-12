# AGENTS.md

## Project Overview

`inialum-disco-message-bot` is a Discord message bot for INIALUM built on Cloudflare Workers + Hono. Its core endpoint `POST /api/v1/messages/welcome` validates a request (Zod OpenAPI) and forwards a formatted "入会通知" embed to a Discord webhook. `/api/*` is protected by JWT auth. OpenAPI schema is served at `/schema/v1` and Swagger UI at `/docs/v1`.

Standard setup, dev, test, and token commands are documented in `README.md`; workspace scripts live in `package.json`. Prefer those sources instead of duplicating commands here.

## Cursor Cloud specific instructions

Non-obvious caveats for running this repo in the Cursor Cloud VM (dependencies are already installed by the startup update script):

- Toolchain: `packageManager` pins `pnpm@9.1.2`. Running `pnpm` inside the repo auto-resolves to 9.1.2 (pnpm self-manages / corepack), even though a newer global pnpm and Node 22 are on `PATH`. No `nvm use` needed.
- Dev port: `pnpm run dev` starts `wrangler dev` on `:7071` (the `README.md` "port 7070" line is stale — trust `package.json`). Run it under a long-lived tmux session, not a one-shot foreground command.
- Local vars (gitignored, required to run): copy `.dev.vars.example` to `.dev.vars` and fill: `ENVIRONMENT="local"`, `TOKEN_SECRET` (generate with `openssl rand -base64 32`), `DISCORD_WEBHOOK_URL`.
- Auth for API testing: `/api/*` requires a `Bearer` JWT signed with `TOKEN_SECRET`. Generate one with `pnpm run create-token` (reads `TOKEN_SECRET` from `.dev.vars`). Requests without it return 401; invalid bodies return 400.
- Webhook side effect: the welcome endpoint does a real `fetch(DISCORD_WEBHOOK_URL)`. Without a valid Discord webhook it returns 500. For local end-to-end verification, point `DISCORD_WEBHOOK_URL` at a local HTTP server that returns a 2xx (a 200/204 makes the endpoint return `{"status":"ok"}`).
- The wrangler 3.x "out-of-date / update available" warning at startup is expected and non-blocking.
