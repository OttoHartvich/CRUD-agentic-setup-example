import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { GetPostWithCommentsDocument } from '../gql/graphql'

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => graphqlClient.request(GetPostWithCommentsDocument, { id }),
    enabled: !!id,
  })
}
