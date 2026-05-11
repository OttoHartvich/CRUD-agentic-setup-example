---
paths:
  - "**/components/*.tsx"
---

# React Component Rules

- Use typed hooks from `../hooks/` for data fetching — never call graphql-request directly
- Use Jotai atoms from `../atoms/` for UI state — never use useState for shared state
- Keep components focused — one responsibility per component
- Extract sub-components when complexity grows
- Handle loading and error states from TanStack Query
