import { createServer } from 'http'
import { createSchema, createYoga } from 'graphql-yoga'
import { typeDefs } from './schema/typeDefs.js'
import { resolvers } from './schema/resolvers.js'
import { createContext } from './context.js'

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  context: ({ request }) => createContext(request),
})

const server = createServer(yoga)

server.listen(4000, () => {
  console.log('GraphQL Yoga server running at http://localhost:4000/graphql')
})
