/**
 * Generates default GraphQL operation files (.graphql) per Prisma model.
 *
 * Output: packages/web/src/graphql/generated/<Model>.generated.graphql
 *
 * Each file contains:
 *   - fragment <Model>Fields  (all scalar/enum fields)
 *   - query Get<Model>($id)
 *   - query List<Model>s
 *   - mutation Create<Model>($input)
 *   - mutation Update<Model>($id, $input)
 *   - mutation Delete<Model>($id)
 *
 * Custom operations live in packages/web/src/graphql/custom/*.graphql — hand-written.
 */

import { Prisma } from '@prisma/client'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'src', 'graphql', 'generated')
mkdirSync(outDir, { recursive: true })

// Read the same overrides file the server uses so we don't emit ops calling
// fields that no longer exist on the generated SDL.
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

  const scalarFields = m.fields
    .filter((f) => f.kind === 'scalar' || f.kind === 'enum')
    .map((f) => `  ${f.name}`)
    .join('\n')

  const ops: string[] = []
  ops.push(`fragment ${Name}Fields on ${Name} {\n${scalarFields}\n}`)

  if (!overriddenQueries.has(lower)) {
    ops.push(
      `query Get${Name}($id: ID!) {\n  ${lower}(id: $id) {\n    ...${Name}Fields\n  }\n}`
    )
  }
  if (!overriddenQueries.has(plural)) {
    ops.push(
      `query List${Name}s {\n  ${plural} {\n    ...${Name}Fields\n  }\n}`
    )
  }
  if (!overriddenQueries.has(`${plural}Count`)) {
    ops.push(`query Count${Name}s {\n  ${plural}Count\n}`)
  }
  if (!overriddenMutations.has(`create${Name}`)) {
    ops.push(
      `mutation Create${Name}($input: ${Name}CreateInput!) {\n  create${Name}(input: $input) {\n    ...${Name}Fields\n  }\n}`
    )
  }
  if (!overriddenMutations.has(`update${Name}`)) {
    ops.push(
      `mutation Update${Name}($id: ID!, $input: ${Name}UpdateInput!) {\n  update${Name}(id: $id, input: $input) {\n    ...${Name}Fields\n  }\n}`
    )
  }
  if (!overriddenMutations.has(`delete${Name}`)) {
    ops.push(
      `mutation Delete${Name}($id: ID!) {\n  delete${Name}(id: $id) {\n    id\n  }\n}`
    )
  }

  const content = `# Auto-generated — DO NOT EDIT
# Default operations for ${Name}. Add custom ops in src/graphql/custom/.

${ops.join('\n\n')}
`

  writeFileSync(join(outDir, `${Name}.generated.graphql`), content)
  console.log(`Generated ${Name}.generated.graphql`)
}

console.log(`Done: ${models.length} models`)
