---
name: generate-graphql
description: Generate GraphQL typeDefs and default resolvers from the Prisma schema
allowed-tools: Bash Read
argument-hint: []
---

Run the GraphQL generator from the workspace root:

```bash
npm run generate:graphql
```

This emits:
- `packages/server/src/schema/generated/typeDefs.generated.ts` — SDL types, enums, default Query/Mutation root
- `packages/server/src/schema/generated/resolvers.generated.ts` — default CRUD resolvers + relation field resolvers

Custom queries/mutations live in `packages/server/src/schema/custom/` and override generated fields via `packages/server/src/schema/custom/overrides.json`.

After running, report what was generated. Read the generated files to confirm they look correct.
