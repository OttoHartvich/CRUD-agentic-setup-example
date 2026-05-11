---
name: pipeline
description: Run the full generation pipeline (migrate, CRUD, schema export, frontend types)
allowed-tools: Bash Read
argument-hint: []
---

Run the full generation pipeline in order:

```bash
npm run pipeline
```

This runs:
1. `npm run db:migrate` — Apply Prisma schema changes
2. `npm run generate:crud` — Regenerate CRUD functions from DMMF
3. `npm run emit:schema` — Export schema.graphql for frontend codegen
4. `npm run generate:gql-types` — Generate frontend TypedDocumentNodes

Report the results of each step. If any step fails, stop and report the error.
