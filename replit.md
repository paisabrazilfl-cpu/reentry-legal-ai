# ReEntry Legal AI

A mobile AI assistant that helps people in reentry programs understand their legal rights, cross-reference applicable laws, and find available remedies — with deep knowledge of Kentucky DOC program catalogs, BOP reentry guidelines, and Dismas Charities rules.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL` — auto-provisioned via Replit OpenAI integration

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo SDK 54 (React Native, web-compatible)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- AI: OpenAI via Replit AI Integrations proxy (gpt-5.4)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile/` — Expo mobile app
  - `app/(tabs)/index.tsx` — "Ask" tab: quick-start prompts + free-text input
  - `app/(tabs)/history.tsx` — conversation history list
  - `app/(tabs)/resources.tsx` — expandable legal reference guide
  - `app/chat/[id].tsx` — chat conversation screen with SSE streaming
  - `constants/colors.ts` — navy/gold legal theme (light + dark)
  - `hooks/useConversations.ts` — React Query wrappers for conversation API
- `artifacts/api-server/src/routes/openai/index.ts` — all conversation + streaming endpoints
- `lib/db/src/schema/conversations.ts` + `messages.ts` — DB schema
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/api-zod/` — generated Zod schemas
- `lib/api-client-react/` — generated React Query hooks

## Architecture decisions

- **Contract-first API**: OpenAPI spec → Orval codegen → typed hooks + Zod validators on both client and server
- **SSE streaming**: AI responses stream token-by-token via Server-Sent Events; `expo/fetch` handles streaming on mobile
- **Comprehensive system prompt**: The AI is pre-loaded with Kentucky DOC program catalogs, BOP reentry handbook, constitutional rights, federal law (First Step Act, § 3624), KY state law (KRS 197.045, 439.345), BOP policies (PS 5140.40, RDAP), Dismas Charities rules, and key case law
- **Conversation history**: All messages persisted in PostgreSQL; full history sent back to AI each turn for context continuity
- **Auto-title**: New conversations are auto-titled from the first message's leading words

## Product

Users can:
1. **Ask** — Type any legal question or describe a situation and get a full legal analysis
2. **Quick prompts** — Rights violations, program credit, halfway house rights, expose an issue
3. **Chat** — Multi-turn conversations with streamed AI responses
4. **History** — Browse and resume past conversations, delete ones they no longer need
5. **Resources** — Quick-reference guide to constitutional rights, federal/KY law, BOP policies, DOC programs, key case law, and reentry remedies

The AI structures every response with: Direct Answer → Legal Framework → Available Remedies → Legal Arguments → Case Law.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- DB tables are `conversations` and `messages` (not `conversationsTable`/`messagesTable`) — import as aliased: `import { conversations as conversationsTable, messages as messagesTable } from "@workspace/db"`
- Always run `pnpm --filter @workspace/api-spec run codegen` after editing `lib/api-spec/openapi.yaml`
- `lib/integrations-openai-ai-react` needs `@types/react` in devDependencies and `jsx: react-jsx` in tsconfig
- `lib/integrations-openai-ai-server/src/image/client.ts` uses optional chaining on `response.data` (`response.data?.[0]`)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
