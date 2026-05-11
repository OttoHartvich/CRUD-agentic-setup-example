---
paths:
  - "**/services/*.ts"
---

# Service Layer Rules

- Import CRUD functions from `../generated/`, never use PrismaClient directly
- Each service function should have a clear single responsibility
- Include proper error handling for not-found and unauthorized cases
- Throw descriptive errors (e.g., `new Error('Post not found')`, `new Error('Not authorized')`)
- All functions should be named exports
