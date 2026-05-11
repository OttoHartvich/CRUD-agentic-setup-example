# Live Demo Script: Add a Like System

## Premise

Starting from a working blog app (posts, comments, users), add a "Like" feature end-to-end using the agentic + codegen pipeline.

## Pre-Demo Setup

```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev:server   # terminal 1
npm run dev:web      # terminal 2
```

Have the app open in a browser showing the post list. Optionally have GraphiQL open at http://localhost:4000/graphql.

## Act 1: Schema Change (schema-design agent)

**Prompt:**
> "I want users to be able to like posts. Add a Like model."

The schema-design agent adds to `schema.prisma`:
- `Like` model with `userId` + `postId` relations
- `@@unique([userId, postId])` to prevent duplicate likes
- Relation fields on `User` and `Post`

Then run:
```
/pipeline
```

Audience sees: migration applied, CRUD functions auto-generated for the new `Like` model.

## Act 2: Business Logic (business-logic agent)

**Prompt:**
> "Write the service layer for likes — toggle behavior, and add a like count helper."

The business-logic agent:
- Reads the generated `like.crud.ts`
- Creates `like.service.ts` with `toggleLike()` (idempotent like/unlike) and `getLikeCount()`
- Imports from generated CRUD, never touches Prisma directly

**What to highlight:** AI writes the interesting logic (toggle, uniqueness check), generation handled the boilerplate.

## Act 3: GraphQL Layer (agent + codegen)

**Prompt:**
> "Add a likePost mutation and a likes count field on Post to the GraphQL schema."

AI updates:
- `typeDefs.ts` — adds `likePost(postId: ID!): Boolean!` mutation + `likesCount: Int!` on Post type
- `resolvers.ts` — wires to service functions

Then run:
```
/generate-types
```

Audience sees: typed `LikePostDocument` and updated `Post` type with `likesCount` appear in `packages/web/src/gql/`.

**Optional checkpoint:** test the mutation in GraphiQL.

## Act 4: Frontend Component (frontend agent)

**Prompt:**
> "Add a heart button with like count to each post in the post list."

The frontend agent:
- Reads the generated typed documents
- Creates a `useLikePost` hook wrapping TanStack Query
- Adds a `<LikeButton>` component with optimistic UI via Jotai atom
- Integrates it into `PostList.tsx`

**What to highlight:** the component is fully typed end-to-end — from Prisma schema to React prop types, with zero manual type definitions.

## Key Talking Points

| Step | Method | What it does |
|------|--------|-------------|
| Schema → CRUD | **Code generation** | Eliminates boilerplate data access layer |
| CRUD → Services | **AI agent** | Writes business logic with validation and authorization |
| Services → GraphQL | **AI agent** | Wires service layer to API with type definitions |
| GraphQL → FE types | **Code generation** | Produces typed document nodes and query types |
| FE types → Components | **AI agent** | Builds UI using fully typed hooks and state atoms |

**The contrast is the point:** generation handles the mechanical plumbing, AI handles the creative decisions. Neither alone is as fast as both together.

## Timing

Expect 3-5 minutes for the full demo, depending on model response speed.

## Risk Mitigation

- Everything runs locally (Docker + localhost) — no network dependency
- Pre-seed the database so there's data to display immediately
- If an agent step is slow, narrate what it's doing while it works
- Have a git branch with the completed Like feature as a fallback (`git stash` the demo, `git checkout with-likes`)
