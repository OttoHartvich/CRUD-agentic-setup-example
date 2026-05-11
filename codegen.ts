import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'packages/server/schema.graphql',
  documents: 'packages/web/src/graphql/**/*.graphql',
  generates: {
    'packages/web/src/gql/': {
      preset: 'client',
    },
  },
}

export default config
