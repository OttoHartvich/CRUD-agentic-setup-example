---
name: generate-types
description: Generate frontend GraphQL types and typed document nodes from the server schema
allowed-tools: Bash Read
argument-hint: []
---

Run the schema export and frontend codegen:

```bash
npm run emit:schema && npm run generate:gql-types
```

After running, report which typed operations were generated in `packages/web/src/gql/`.
