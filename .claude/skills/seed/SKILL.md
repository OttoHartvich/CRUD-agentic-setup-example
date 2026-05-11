---
name: seed
description: Seed the database with sample test data
allowed-tools: Bash Read
argument-hint: []
---

Seed the database with test data:

```bash
npm run db:seed
```

This runs `packages/db/prisma/seed.ts` which populates the database with sample users, posts, and comments for development and testing.
