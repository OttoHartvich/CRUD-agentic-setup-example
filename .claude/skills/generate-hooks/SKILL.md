---
name: generate-hooks
description: Generate default TanStack Query hooks for each Prisma model
allowed-tools: Bash Read
argument-hint: []
---

Run the hooks generator from the workspace root:

```bash
npm run generate:hooks
```

Depends on `generate:gql-types` having run first (consumes the emitted `TypedDocumentNode`s). The pipeline script handles ordering.

Emits one `<model>.hooks.ts` per model into `packages/web/src/hooks/generated/`, with:
- `useGet<Model>(id)` — `useQuery`
- `useList<Model>s()` — `useQuery`
- `useCount<Model>s()` — `useQuery`
- `useCreate<Model>()`, `useUpdate<Model>()`, `useDelete<Model>()` — `useMutation` with cache invalidation

Custom hooks live in `packages/web/src/hooks/custom/` and the existing root `packages/web/src/hooks/` — hand-written.
