# Mock GraphQL + Prisma — Codegen × AI Demo

A demo stack showing how **deterministic codegen** and **AI agents** divide labor:

- **Codegen owns the mechanical layer** — CRUD funcs, SDL, resolvers, GraphQL operations, typed hooks — all derived from `schema.prisma`.
- **AI agents own the judgment layer** — services (auth, validation, composition), custom GraphQL ops, React components.

The result: agents never hand-write boilerplate that a script could generate, and never edit generated files. They compose on top.

## Stack

- npm workspaces — `packages/db`, `packages/server`, `packages/web`
- Prisma + Postgres (Docker)
- GraphQL Yoga
- React + Vite + Jotai + TanStack Query

## Run it

```bash
npm install
npm run db:up          # Postgres in Docker
npm run pipeline       # migrate + generate everything
npm run db:seed        # sample data (optional)
npm run dev            # server :4000 + web :5173
```

`.env` needs `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mockgql`.

## The pipeline (deterministic layer)

`schema.prisma` is the single source of truth. `npm run pipeline` cascades it through:

| Step | Script | Output |
|---|---|---|
| 1 | `db:migrate` | Prisma migrations + client |
| 2 | `generate:crud` | `packages/db/src/generated/` — CRUD funcs (`paginate`, `count`, `upsert`, …) |
| 3 | `generate:graphql` | `packages/server/src/schema/generated/` — SDL + default resolvers |
| 4 | `generate:operations` | `packages/web/src/graphql/generated/` — default `.graphql` ops per model |
| 5 | `emit:schema` | `packages/server/schema.graphql` snapshot |
| 6 | `generate:gql-types` | `packages/web/src/gql/` — TypedDocumentNodes |
| 7 | `generate:hooks` | `packages/web/src/hooks/generated/` — TanStack Query hooks per model |

**Never edit generated dirs.** Re-run the pipeline after any `schema.prisma` change.

## The agent layer (judgment)

Hand-written code lives in parallel `custom/` / services / components dirs and composes on top of generated output:

- `packages/db/src/services/` — business logic (auth, validation) over generated CRUD
- `packages/server/src/schema/custom/` — custom GraphQL ops; fields claimed via `overrides.json` skip codegen
- `packages/web/src/graphql/custom/` + `packages/web/src/hooks/` — hand-written ops and the hooks that wrap them
- `packages/web/src/components/` + `atoms/` — React UI on typed hooks + Jotai

Hard rules: services never touch `PrismaClient` directly; custom resolvers go through services; components only use typed hooks.

## Orchestrating agents

Specialist agents under `.claude/agents/` each own one layer:

| Agent | Owns |
|---|---|
| `schema-design` | `schema.prisma` edits |
| `business-logic` | services + custom GraphQL ops |
| `frontend` | React components + custom hooks |
| `code-reviewer` | audits diffs against `.claude/rules/` |
| `orchestrator` | chains the above end-to-end and routes review findings back |

### End-to-end feature flow

The `/feature` skill (or invoking `orchestrator` directly) runs:

1. **schema-design** → edits `schema.prisma`
2. **pipeline** runs → all generated layers refresh
3. **business-logic** → adds service + custom GraphQL op (lists overridden fields in `overrides.json`)
4. **frontend** → adds custom `.graphql`, custom hook, React component
5. **code-reviewer** → audits the diff; findings route back to the implementing agent

The orchestrator's job is the boundary work: deciding which agent picks up each piece, when to re-run the pipeline, and when a review finding belongs to the schema vs. the service vs. the UI.

### Skills

Invocable via `/skill-name` in Claude Code:

- `/pipeline` — run the full generation pipeline
- `/generate-crud`, `/generate-graphql`, `/generate-operations`, `/generate-hooks`, `/generate-types` — individual steps
- `/seed` — seed sample data
- `/code-review` — review recent diff
- `/feature` — end-to-end feature delivery via the orchestrator

### Why this split works

Codegen guarantees the boring layer is correct and consistent across the stack. Agents spend their context on the parts that actually need judgment — business rules, auth, UX — and never drift from the schema because they don't write the types themselves.

## Layout

```
mockGraphqlPrisma/
├── CLAUDE.md                 # Project instructions for agents
├── codegen.ts                # graphql-codegen config
├── docker-compose.yml        # Postgres
├── .claude/
│   ├── agents/               # Specialist agent prompts
│   ├── rules/                # Shared rule docs
│   └── skills/               # Invocable skills
└── packages/
    ├── db/                   # Prisma + generated CRUD + services
    ├── server/               # GraphQL Yoga (generated + custom typeDefs/resolvers)
    └── web/                  # React + generated ops/hooks + custom hooks/components
```

See `CLAUDE.md` for full conventions.
