import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { RemoveTagFromPostDocument } from '../gql/graphql'

export function useRemoveTagFromPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { postId: string; tagName: string }) =>
      graphqlClient.request(RemoveTagFromPostDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['postsByTag'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}
