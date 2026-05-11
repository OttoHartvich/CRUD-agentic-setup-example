---
name: generate-operations
description: Generate default frontend GraphQL operation files (.graphql) per Prisma model
allowed-tools: Bash Read
argument-hint: []
---

Run the operations generator from the workspace root:

```bash
npm run generate:operations
```

This emits one `.graphql` file per Prisma model into `packages/web/src/graphql/generated/`, each containing:
- A `<Model>Fields` fragment (all scalar/enum fields)
- `Get<Model>`, `List<Model>s`, `Count<Model>s` queries
- `Create<Model>`, `Update<Model>`, `Delete<Model>` mutations

Fields listed in `packages/server/src/schema/custom/overrides.json` are skipped (custom ops handle them).

Custom operations live in `packages/web/src/graphql/custom/` — hand-written.
