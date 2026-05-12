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

## File Structure
Stable scaffolding shown as files; dynamic dirs (📂) described by purpose — contents grow per model/feature/migration and are not worth tracking individually.

```
mockGraphqlPrisma/
├── CLAUDE.md                       # This file — project instructions
├── DEMO.md                         # Demo walkthrough
├── codegen.ts                      # graphql-codegen config (drives generate:gql-types)
├── docker-compose.yml              # Postgres container
├── package.json                    # Root workspaces + pipeline scripts
├── tsconfig.json                   # Root TS config
├── .env                            # DATABASE_URL etc.
│
├── .claude/
│   ├── settings.json
│   ├── 📂 agents/                  # One subdir per specialist (agent.md prompt inside)
│   ├── 📂 rules/                   # Shared rule docs referenced by agents (one .md per topic)
│   └── 📂 skills/                  # Invocable skills — one subdir per skill, each holds SKILL.md
│
├── 📂 prototypes/                  # Static HTML/design mockups (scratch surface)
│
└── packages/
    ├── db/                         # Prisma + CRUD + services
    │   ├── CLAUDE.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── prisma/
    │   │   ├── schema.prisma       # SOURCE OF TRUTH — drives whole pipeline
    │   │   ├── seed.ts
    │   │   └── 📂 migrations/      # Timestamped Prisma migrations (grows on every schema change)
    │   ├── scripts/
    │   │   └── generate-crud.ts    # DMMF → generated/*.crud.ts
    │   └── src/
    │       ├── index.ts            # Package entrypoint
    │       ├── client.ts           # PrismaClient singleton
    │       ├── 📂 generated/       # ⚠ AUTO-GENERATED — one *.crud.ts per model + index/types
    │       └── 📂 services/        # Hand-written business logic — one *.service.ts per model
    │
    ├── server/                     # GraphQL Yoga API
    │   ├── CLAUDE.md
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── schema.graphql          # Emitted SDL snapshot
    │   ├── scripts/
    │   │   └── generate-graphql.ts # DMMF → generated SDL + resolvers
    │   └── src/
    │       ├── index.ts            # Yoga server bootstrap (:4000)
    │       ├── context.ts          # GraphQL context (auth, prisma, services)
    │       ├── emit-schema.ts      # Writes schema.graphql
    │       └── schema/
    │           ├── typeDefs.ts     # Merges generated + custom typeDefs
    │           ├── resolvers.ts    # Merges generated + custom resolvers
    │           ├── 📂 generated/   # ⚠ AUTO-GENERATED — typeDefs + resolvers from DMMF
    │           └── custom/         # Hand-written overrides / extensions
    │               ├── overrides.json          # Field allowlist claimed by custom layer
    │               ├── typeDefs.custom.ts      # Custom SDL (grows per feature)
    │               └── resolvers.custom.ts     # Matching resolvers (grows per feature)
    │
    └── web/                        # React + Vite frontend
        ├── CLAUDE.md
        ├── package.json
        ├── tsconfig.json
        ├── vite.config.ts
        ├── index.html
        ├── scripts/
        │   ├── generate-operations.ts  # DMMF → default .graphql ops
        │   └── generate-hooks.ts       # DMMF + docs → TanStack Query hooks
        └── src/
            ├── main.tsx
            ├── App.tsx
            ├── 📂 atoms/           # Jotai UI state atoms (grows per UI concern)
            ├── 📂 components/      # React components (grows per feature)
            ├── 📂 lib/             # Small shared utilities (graphql client, query client, formatters)
            ├── 📂 gql/             # ⚠ AUTO-GENERATED by graphql-codegen — TypedDocumentNodes + types
            ├── graphql/
            │   ├── 📂 generated/   # ⚠ AUTO-GENERATED — one <Model>.generated.graphql per model
            │   └── 📂 custom/      # Hand-written .graphql ops (queries/mutations with relations etc.)
            └── hooks/
                ├── 📂 generated/   # ⚠ AUTO-GENERATED — one *.hooks.ts per model
                └── 📂 (root)       # Hand-written custom hooks — one use*.ts per custom op
```
