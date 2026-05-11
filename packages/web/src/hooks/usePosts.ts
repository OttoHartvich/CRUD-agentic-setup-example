import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { GetPostsDocument } from '../gql/graphql'

export function usePosts(published?: boolean) {
  return useQuery({
    queryKey: ['posts', { published }],
    queryFn: () => graphqlClient.request(GetPostsDocument, { published }),
  })
}
