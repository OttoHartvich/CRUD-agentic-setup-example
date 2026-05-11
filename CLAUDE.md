# Mock GraphQL + Prisma Demo

## Stack
- **Monorepo**: npm workspaces with 3 packages (`packages/db`, `packages/server`, `packages/web`)
- **DB**: Prisma ORM + PostgreSQL (Docker)
- **API**: GraphQL Yoga
- **Frontend**: React + Vite + Jotai (atoms) + TanStack Query

## Generation Pipeline
`schema.prisma` is the single source of truth. The pipeline cascades changes:

1. **`generate:crud`** — Prisma DMMF → `packages/db/src/generated/` (CRUD funcs + `paginate`, `count`, `upsert`, `findFirst`)
2. **`generate:graphql`** — DMMF → `packages/server/src/schema/generated/` (SDL types, enums, inputs, default Query/Mutation, relation resolvers)
3. **`generate:operations`** — DMMF → `packages/web/src/graphql/generated/` (default `.graphql` ops per model)
4. **`emit:schema`** — Yoga schema → `packages/server/schema.graphql`
5. **`generate:gql-types`** — schema + ops → `packages/web/src/gql/` (TypedDocumentNodes + types)
6. **`generate:hooks`** — DMMF + generated docs → `packages/web/src/hooks/generated/` (TanStack Query hooks per model)

### Agent layer (the judgment work)
- Services in `packages/db/src/services/` add business logic (auth, validation, composition) on top of generated CRUD
- Custom GraphQL ops in `packages/server/src/schema/custom/` declare auth-aware mutations and queries with non-default signatures
- `packages/server/src/schema/custom/overrides.json` lists fields the custom layer claims so the generator skips them
- Custom frontend ops in `packages/web/src/graphql/custom/` add hand-written queries (e.g., with relations)
- Custom hooks in `packages/web/src/hooks/` wrap custom ops with TanStack Query
- React components compose generated + custom hooks + Jotai atoms

## Commands
```
npm run db:up              # Start PostgreSQL via Docker
npm run db:migrate         # Run Prisma migrations + generate client
npm run generate:crud      # Generate CRUD funcs from schema
npm run generate:graphql   # Generate SDL + default resolvers from schema
npm run generate:operations# Generate default .graphql files per model
npm run generate:gql-types # Generate frontend TypedDocumentNodes
npm run generate:hooks     # Generate TanStack Query hooks per model
npm run emit:schema        # Export schema.graphql
npm run pipeline           # Run full generation pipeline (all of the above)
npm run dev:server         # Start GraphQL Yoga on :4000
npm run dev:web            # Start Vite dev server
```

## Conventions
- **Never edit** auto-generated dirs: `packages/db/src/generated/`, `packages/server/src/schema/generated/`, `packages/web/src/graphql/generated/`, `packages/web/src/gql/`, `packages/web/src/hooks/generated/`
- Services import from `generated/` CRUD, never use PrismaClient directly
- Custom resolvers import from services, never from PrismaClient or generated CRUD directly
- To override a default GraphQL field, list it in `packages/server/src/schema/custom/overrides.json` and declare it in the custom typeDefs+resolvers
- Frontend components use typed hooks (generated or custom), never call graphql-request directly
- UI state lives in Jotai atoms (`atoms/`), server state in TanStack Query hooks

## Agents
Specialist agents under `.claude/agents/`:
- `schema-design` — edits `schema.prisma`
- `business-logic` — writes services + custom GraphQL ops
- `frontend` — writes React components + custom hooks
- `code-reviewer` — audits diffs against the rules in `.claude/skills/code-review/SKILL.md`
- `orchestrator` — chains the above for end-to-end features and routes review findings back to the implementing agent
