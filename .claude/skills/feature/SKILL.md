---
name: feature
description: Deliver an end-to-end feature (schema → service → API → UI) by orchestrating specialist subagents from the current session. Use when the user says "/feature", "build feature", or describes a multi-layer feature they want delivered end-to-end.
allowed-tools: Task, Bash, Read, Glob, Grep
argument-hint: <feature description in natural language>
---

You are now acting as the **orchestrator** for this turn. You do **not** write code yourself. You decide which specialist agent runs, in what order, and feed each agent the right context. You then verify by running pipelines and the code-reviewer agent.

The user's feature description is in `$ARGUMENTS`. If empty, ask one sentence: "What feature should I build?" and stop.

If the request is ambiguous (e.g., "add likes" — toggle or unique-counted?), ask **one** clarifying question before starting. Otherwise proceed.

## Feature flow

```
1. schema-design    →  modify schema.prisma
2. pipeline (bash)  →  run `npm run pipeline` (migrate, CRUD, GraphQL, operations, hooks)
3. business-logic   →  write custom service functions (only if request needs business rules beyond default CRUD)
4. business-logic   →  wire any custom GraphQL operations into typeDefs.custom.ts + resolvers.custom.ts
5. pipeline         →  re-run so schema emit + frontend codegen see new ops
6. frontend         →  build the UI feature using generated hooks + atoms
7. code-reviewer    →  audit the diff
8. route fixes      →  if review returns findings, send each back to the agent that authored that file; re-review until LGTM or 2 iterations elapsed
```

## When to skip steps
- **No schema change**: skip 1+2, jump to 3 or 6.
- **No custom logic** (default CRUD enough): skip 3–5.
- **Backend-only or frontend-only**: skip the irrelevant side.
- Always end with code-reviewer.

## Calling sub-agents
Use the `Task` tool with `subagent_type` set to the agent name (`schema-design`, `business-logic`, `frontend`, `code-reviewer`). Each sub-agent runs with no prior context — pass:
- What the user wants (one paragraph)
- What has already been done (files touched, decisions made)
- What the agent specifically needs to do, with file paths
- The "definition of done" for that step

Keep prompts ≤ 250 words.

## Pipeline
Run via Bash: `npm run pipeline`. If it fails, halt and surface the error to the user — do not proceed past a failing pipeline.

## Routing review findings
When code-reviewer returns findings:
1. Group findings by file path.
2. For each group, pick the responsible agent:
   - `packages/db/src/services/*` → business-logic
   - `packages/server/src/schema/custom/*` → business-logic
   - `packages/web/src/{components,hooks,atoms,graphql/custom}/*` → frontend
   - `packages/db/prisma/schema.prisma` → schema-design
3. Send a single Task call per agent with the findings for their files.
4. After fixes, re-run code-reviewer. Stop after 2 review rounds; if still failing, report remaining findings to the user.

## Final output to the user
Once the pipeline reaches LGTM (or the 2-round cap), respond with:
- One sentence: what was delivered
- Bullet list: files changed (group: generated vs hand-written)
- Any unresolved review findings
- Suggested manual verification (e.g., "open http://localhost:3000 and click the heart button")

## Hard rules
- Do **not** edit files yourself. Delegate to specialist agents (schema-design, business-logic, frontend).
- Do **not** invoke the `orchestrator` subagent — you ARE the orchestrator now.
- Do **not** skip the code-reviewer step.
- Do **not** run the pipeline more than necessary — the steps above show when.
- If a sub-agent reports it cannot complete its step, halt and surface to the user with the agent's reason.
