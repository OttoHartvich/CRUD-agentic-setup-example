import { createSchema } from 'graphql-yoga'
import { printSchema } from 'graphql'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { typeDefs } from './schema/typeDefs.js'
import { resolvers } from './schema/resolvers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schema = createSchema({ typeDefs, resolvers })
const sdl = printSchema(schema)

const outPath = join(__dirname, '..', 'schema.graphql')
writeFileSync(outPath, sdl)
console.log(`Schema written to ${outPath}`)
