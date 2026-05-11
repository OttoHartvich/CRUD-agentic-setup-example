---
paths:
  - "**/*.prisma"
---

# Prisma Schema Rules

- After modifying schema.prisma, always run `npm run db:migrate` to apply the migration
- Then run `npm run generate:crud` to regenerate the CRUD layer
- Never manually edit files in `packages/db/src/generated/` — they are auto-generated
- Use `@default(cuid())` for ID fields
- Use `@default(now())` for createdAt, `@updatedAt` for updatedAt
- Always define both sides of a relation
