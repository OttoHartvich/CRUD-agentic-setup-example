# @mock/db — Database Package

## Adding a New Model
1. Edit `prisma/schema.prisma`
2. Run `npm run pipeline` from root — applies migration, regenerates everything
3. If the model needs business rules, add a service in `src/services/<model>.service.ts`

## Structure
- `prisma/schema.prisma` — Source of truth for the data model
- `src/client.ts` — PrismaClient singleton (import this, don't create new instances)
- `src/generated/` — Auto-generated (DO NOT EDIT)
  - `<model>.crud.ts` — create, findUnique, findFirst, findMany, update, upsert, delete, count, paginate
  - `types.ts` — shared types (`PaginatedResult<T>`)
  - `index.ts` — barrel
- `src/services/` — Business logic layer (AI-written, imports only from `generated/`)
- `scripts/generate-crud.ts` — The CRUD generator script (reads Prisma DMMF)

## Service Layer Pattern
Services import CRUD functions and add validation, authorization, and composition:
```ts
import { createPost, findUniquePost } from '../generated/post.crud.js'
```
