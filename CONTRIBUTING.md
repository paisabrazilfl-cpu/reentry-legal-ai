# Contributing to ReEntry Legal AI

Thanks for your interest in contributing. This guide covers everything you need to get a change from idea to merged pull request.

---

## Table of contents

1. [Getting started](#1-getting-started)
2. [Branch naming](#2-branch-naming)
3. [Commit style](#3-commit-style)
4. [Running the project locally](#4-running-the-project-locally)
5. [Checks that must pass](#5-checks-that-must-pass)
6. [Opening a pull request](#6-opening-a-pull-request)

---

## 1. Getting started

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/reentry-legal-ai.git
cd reentry-legal-ai

# Install dependencies (requires Node.js 24 and pnpm)
pnpm install

# Copy the example env file and fill in your values
cp .env.example .env
```

**Required environment variables:**

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | OpenAI API key (or auto-provisioned on Replit) |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | OpenAI base URL (`https://api.openai.com/v1` outside Replit) |

---

## 2. Branch naming

Use a short, lowercase, hyphenated name prefixed by type:

| Type | Prefix | Example |
|---|---|---|
| New feature | `feat/` | `feat/appeal-letter-template` |
| Bug fix | `fix/` | `fix/sse-stream-disconnects` |
| Documentation | `docs/` | `docs/update-setup-guide` |
| Chore / tooling | `chore/` | `chore/upgrade-expo-sdk` |

Branch off `main`:

```bash
git checkout main && git pull
git checkout -b feat/your-feature-name
```

---

## 3. Commit style

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body — what changed and why]
```

**Types:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`

**Scope** is optional but helpful — use the package or area changed: `mobile`, `api-server`, `db`, `ci`, `openapi`.

Examples:

```
feat(mobile): add draft letter screen with reinforce button
fix(api-server): handle SSE disconnects cleanly on client abort
docs: add CONTRIBUTING guide
chore(ci): add lint job to CI pipeline
```

Keep the subject line under 72 characters and use the imperative mood ("add", not "added" or "adds").

---

## 4. Running the project locally

**Push the database schema** (first time or after schema changes):

```bash
pnpm --filter @workspace/db run push
```

**Start the API server** (port 5000):

```bash
pnpm --filter @workspace/api-server run dev
```

**Start the mobile app** (in a separate terminal):

```bash
pnpm --filter @workspace/mobile run dev
```

**After editing the OpenAPI spec** (`lib/api-spec/openapi.yaml`), regenerate the typed hooks and Zod schemas:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## 5. Checks that must pass

All CI checks run automatically on every pull request. Run them locally before pushing:

```bash
# TypeScript — full typecheck across all packages
pnpm run typecheck

# ESLint — code style and quality
pnpm run lint
```

Both commands must exit with code 0. The CI pipeline will block the PR if either fails.

A few things to keep in mind:

- **Never use `console.log` in server code.** Use `req.log` inside route handlers and the singleton `logger` elsewhere.
- **Run codegen after any OpenAPI changes.** Forgetting this causes TypeScript errors in the generated client.
- **DB import alias.** Import tables as `import { conversations as conversationsTable, messages as messagesTable } from "@workspace/db"` — the exports are named `conversations` and `messages`, not `conversationsTable`/`messagesTable`.

---

## 6. Opening a pull request

1. Push your branch and open a PR against `main`.
2. Fill in the PR description: what changed, why, and any testing notes.
3. Wait for the CI checks (Typecheck + Lint) to go green.
4. Request a review — a maintainer will respond within a few days.
5. Address any review comments, push updates to the same branch, and re-request review.
6. Once approved, a maintainer will squash-merge your PR.

For large changes (new features, schema migrations, API contract changes) consider opening an issue first to discuss the approach before writing code.

---

*Questions? Open a [GitHub Discussion](https://github.com/paisabrazilfl-cpu/reentry-legal-ai/discussions) or file an issue.*
