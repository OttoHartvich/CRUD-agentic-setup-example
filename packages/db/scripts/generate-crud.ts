import { Prisma } from '@prisma/client'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'src', 'generated')

mkdirSync(outDir, { recursive: true })

const models = Prisma.dmmf.datamodel.models

for (const model of models) {
  const name = model.name
  const lower = name.charAt(0).toLowerCase() + name.slice(1)
  const fileName = `${lower}.crud.ts`

  const content = `// Auto-generated CRUD for ${name} — DO NOT EDIT
import { Prisma } from '@prisma/client'
import { prisma } from '../client.js'
import type { PaginatedResult } from './types.js'

export async function create${name}(data: Prisma.${name}CreateInput) {
  return prisma.${lower}.create({ data })
}

export async function findMany${name}s(args?: Prisma.${name}FindManyArgs) {
  return prisma.${lower}.findMany(args)
}

export async function findUnique${name}(where: Prisma.${name}WhereUniqueInput) {
  return prisma.${lower}.findUnique({ where })
}

export async function findFirst${name}(args?: Prisma.${name}FindFirstArgs) {
  return prisma.${lower}.findFirst(args)
}

export async function update${name}(
  where: Prisma.${name}WhereUniqueInput,
  data: Prisma.${name}UpdateInput
) {
  return prisma.${lower}.update({ where, data })
}

export async function upsert${name}(
  where: Prisma.${name}WhereUniqueInput,
  create: Prisma.${name}CreateInput,
  update: Prisma.${name}UpdateInput
) {
  return prisma.${lower}.upsert({ where, create, update })
}

export async function delete${name}(where: Prisma.${name}WhereUniqueInput) {
  return prisma.${lower}.delete({ where })
}

export async function count${name}s(where?: Prisma.${name}WhereInput) {
  return prisma.${lower}.count({ where })
}

export async function paginate${name}s(args: {
  where?: Prisma.${name}WhereInput
  orderBy?: Prisma.${name}OrderByWithRelationInput
  include?: Prisma.${name}Include
  page?: number
  pageSize?: number
}): Promise<PaginatedResult<Awaited<ReturnType<typeof prisma.${lower}.findMany>>[number]>> {
  const page = Math.max(1, args.page ?? 1)
  const pageSize = Math.min(100, Math.max(1, args.pageSize ?? 20))
  const skip = (page - 1) * pageSize

  const [items, total] = await Promise.all([
    prisma.${lower}.findMany({
      where: args.where,
      orderBy: args.orderBy,
      include: args.include,
      skip,
      take: pageSize,
    }),
    prisma.${lower}.count({ where: args.where }),
  ])

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}
`

  writeFileSync(join(outDir, fileName), content)
  console.log(`Generated ${fileName}`)
}

// Generate barrel index
const barrel = models
  .map((m) => {
    const lower = m.name.charAt(0).toLowerCase() + m.name.slice(1)
    return `export * from './${lower}.crud.js'`
  })
  .join('\n')

writeFileSync(
  join(outDir, 'types.ts'),
  `// Auto-generated shared types — DO NOT EDIT
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
`
)
console.log('Generated types.ts')

writeFileSync(
  join(outDir, 'index.ts'),
  `// Auto-generated barrel — DO NOT EDIT
export type { PaginatedResult } from './types.js'
${barrel}
`
)
console.log('Generated index.ts')
console.log(`Done: ${models.length} models`)
