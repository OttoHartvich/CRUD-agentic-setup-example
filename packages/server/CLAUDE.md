# @mock/server — GraphQL Server

## Architecture
- GraphQL Yoga server on port 4000
- SDL is split: auto-generated base + hand-written custom layer
- `src/schema/typeDefs.ts` and `src/schema/resolvers.ts` merge the two layers
- Request context (`src/context.ts`) provides prisma client and mock current user

## Schema layers
- `src/schema/generated/` — auto-generated (DO NOT EDIT)
  - `typeDefs.generated.ts` — types, enums, default Query/Mutation root, create/update inputs
  - `resolvers.generated.ts` — default CRUD resolvers + relation field resolvers
- `src/schema/custom/` — hand-written by agents
  - `typeDefs.custom.ts` — `extend type Query` / `extend type Mutation` with custom ops
  - `resolvers.custom.ts` — custom resolvers wired to services in `@mock/db`
  - `overrides.json` — fields the custom layer claims; generator skips them

## Adding a Query/Mutation
- **Plain CRUD** is auto-generated. Nothing to add — just regenerate via `npm run pipeline`.
- **Custom signature or auth-aware**:
  1. List the field name in `src/schema/custom/overrides.json` (under `queries` or `mutations`)
  2. Declare it in `typeDefs.custom.ts` (use `extend type Query` / `extend type Mutation`)
  3. Implement the resolver in `resolvers.custom.ts` wired to a service in `@mock/db`
  4. Run `npm run pipeline`

## Emitting Schema
`src/emit-schema.ts` writes the merged schema to `schema.graphql` at the package root. This file is consumed by graphql-codegen on the frontend.

## Generator
`scripts/generate-graphql.ts` reads Prisma DMMF and emits the `generated/` files. Triggered by `npm run generate:graphql` or the full `npm run pipeline`.
