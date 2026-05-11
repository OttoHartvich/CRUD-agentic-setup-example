# @mock/web — React Frontend

## Architecture
- Vite + React 18
- **Server state**: TanStack Query with graphql-request client
- **Client state**: Jotai atoms in `src/atoms/`
- **Type generation**: graphql-codegen client-preset outputs to `src/gql/` (DO NOT EDIT)

## Operation + hook layers
Both operations and hooks are split into generated and custom:
- `src/graphql/generated/` — auto-generated `.graphql` per model (DO NOT EDIT)
  - One file per model with default queries (`Get<X>`, `List<X>s`, `Count<X>s`), mutations (`Create<X>`, `Update<X>`, `Delete<X>`), and a `<X>Fields` fragment
- `src/graphql/custom/` — hand-written `.graphql` ops that need relations or custom signatures
- `src/hooks/generated/` — auto-generated TanStack Query hooks per model (DO NOT EDIT)
  - `useGet<X>(id)`, `useList<X>s()`, `useCount<X>s()`, `useCreate<X>()`, `useUpdate<X>()`, `useDelete<X>()`
- `src/hooks/` — hand-written hooks wrapping custom operations

## Adding a Query/Mutation
- **Default CRUD**: nothing to do — the generated hook already exists. Just call it.
- **Custom (relations or custom args)**:
  1. Add a `.graphql` file in `src/graphql/custom/`
  2. Run `npm run pipeline` (or just `generate:gql-types` + `generate:hooks`) to refresh types
  3. Write a hook in `src/hooks/` importing the new `<OpName>Document`
  4. Use the hook in a component

## Component Pattern
Components use typed hooks for data and Jotai atoms for shared UI state:
```tsx
import { useListPosts } from '../hooks/generated/post.hooks'
import { usePost } from '../hooks/usePost'        // custom hook with relations
import { useAtom } from 'jotai'
import { filterPublishedAtom } from '../atoms/ui.atoms'
```

## Generators
- `scripts/generate-operations.ts` — reads Prisma DMMF, writes default `.graphql` per model
- `scripts/generate-hooks.ts` — reads Prisma DMMF, writes hooks importing TypedDocumentNodes from `src/gql/graphql`
- Both respect `packages/server/src/schema/custom/overrides.json` and skip overridden fields
