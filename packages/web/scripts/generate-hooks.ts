/**
 * Generates default TanStack Query hooks per Prisma model.
 *
 * Output: packages/web/src/hooks/generated/<model>.hooks.ts
 *
 * Hooks per model:
 *   - useGet<Name>(id)       — useQuery
 *   - useList<Name>s()       — useQuery
 *   - useCount<Name>s()      — useQuery
 *   - useCreate<Name>()      — useMutation, invalidates list/count
 *   - useUpdate<Name>()      — useMutation, invalidates list + single
 *   - useDelete<Name>()      — useMutation, invalidates list/count
 *
 * Custom hooks live in packages/web/src/hooks/custom/ — hand-written.
 */

import { Prisma } from '@prisma/client'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'src', 'hooks', 'generated')
mkdirSync(outDir, { recursive: true })

const overridesPath = join(
  __dirname,
  '..',
  '..',
  'server',
  'src',
  'schema',
  'custom',
  'overrides.json'
)
const overrides: { queries: string[]; mutations: string[] } = existsSync(overridesPath)
  ? JSON.parse(readFileSync(overridesPath, 'utf8'))
  : { queries: [], mutations: [] }
const overriddenQueries = new Set(overrides.queries ?? [])
const overriddenMutations = new Set(overrides.mutations ?? [])

const models = Prisma.dmmf.datamodel.models

for (const m of models) {
  const Name = m.name
  const lower = Name.charAt(0).toLowerCase() + Name.slice(1)
  const plural = `${lower}s`

  // Build hook chunks conditional on override config so we don't emit
  // hooks importing non-existent generated Documents.
  const hasGet = !overriddenQueries.has(lower)
  const hasList = !overriddenQueries.has(plural)
  const hasCount = !overriddenQueries.has(`${plural}Count`)
  const hasCreate = !overriddenMutations.has(`create${Name}`)
  const hasUpdate = !overriddenMutations.has(`update${Name}`)
  const hasDelete = !overriddenMutations.has(`delete${Name}`)

  const imports: string[] = []
  if (hasGet) imports.push(`Get${Name}Document`)
  if (hasList) imports.push(`List${Name}sDocument`)
  if (hasCount) imports.push(`Count${Name}sDocument`)
  if (hasCreate) imports.push(`Create${Name}Document`, `type Create${Name}MutationVariables`)
  if (hasUpdate) imports.push(`Update${Name}Document`, `type Update${Name}MutationVariables`)
  if (hasDelete) imports.push(`Delete${Name}Document`, `type Delete${Name}MutationVariables`)

  if (imports.length === 0) {
    // Nothing to emit for this model — all default ops are overridden.
    writeFileSync(
      join(outDir, `${lower}.hooks.ts`),
      `// Auto-generated — DO NOT EDIT\n// All default operations for ${Name} are overridden in custom layer.\nexport {}\n`
    )
    console.log(`Generated ${lower}.hooks.ts (empty)`)
    continue
  }

  const hooks: string[] = []
  if (hasGet) {
    hooks.push(`export function useGet${Name}(id: string) {
  return useQuery({
    queryKey: singleKey(id),
    queryFn: () => graphqlClient.request(Get${Name}Document, { id }),
    enabled: Boolean(id),
  })
}`)
  }
  if (hasList) {
    hooks.push(`export function useList${Name}s() {
  return useQuery({
    queryKey: listKey,
    queryFn: () => graphqlClient.request(List${Name}sDocument),
  })
}`)
  }
  if (hasCount) {
    hooks.push(`export function useCount${Name}s() {
  return useQuery({
    queryKey: countKey,
    queryFn: () => graphqlClient.request(Count${Name}sDocument),
  })
}`)
  }
  if (hasCreate) {
    hooks.push(`export function useCreate${Name}() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: Create${Name}MutationVariables) =>
      graphqlClient.request(Create${Name}Document, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}`)
  }
  if (hasUpdate) {
    hooks.push(`export function useUpdate${Name}() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: Update${Name}MutationVariables) =>
      graphqlClient.request(Update${Name}Document, vars),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: singleKey(vars.id) })
    },
  })
}`)
  }
  if (hasDelete) {
    hooks.push(`export function useDelete${Name}() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: Delete${Name}MutationVariables) =>
      graphqlClient.request(Delete${Name}Document, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}`)
  }

  const content = `// Auto-generated — DO NOT EDIT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../../lib/graphql-client'
import {
  ${imports.join(',\n  ')},
} from '../../gql/graphql'

const listKey = ['${plural}'] as const
const countKey = ['${plural}Count'] as const
const singleKey = (id: string) => ['${lower}', id] as const

${hooks.join('\n\n')}
`

  writeFileSync(join(outDir, `${lower}.hooks.ts`), content)
  console.log(`Generated ${lower}.hooks.ts`)
}

// Barrel
const barrel = models
  .map((m) => {
    const l = m.name.charAt(0).toLowerCase() + m.name.slice(1)
    return `export * from './${l}.hooks.js'`
  })
  .join('\n')

writeFileSync(
  join(outDir, 'index.ts'),
  `// Auto-generated barrel — DO NOT EDIT\n${barrel}\n`
)
console.log(`Done: ${models.length} models`)
