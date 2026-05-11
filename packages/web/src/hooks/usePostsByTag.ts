import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { GetPostsByTagDocument } from '../gql/graphql'

export function usePostsByTag(name: string) {
  return useQuery({
    queryKey: ['postsByTag', name],
    queryFn: () => graphqlClient.request(GetPostsByTagDocument, { name }),
    enabled: Boolean(name),
  })
}
