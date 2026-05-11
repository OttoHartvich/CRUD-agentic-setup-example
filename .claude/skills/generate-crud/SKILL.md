---
name: generate-crud
description: Generate typed CRUD functions from the Prisma schema
allowed-tools: Bash Read
argument-hint: []
---

Run the CRUD generator from the workspace root:

```bash
npm run generate:crud
```

After running, report which files were generated or updated in `packages/db/src/generated/`.
Read the generated files to confirm they look correct.
