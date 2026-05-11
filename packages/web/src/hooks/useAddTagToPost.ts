import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { AddTagToPostDocument } from '../gql/graphql'

export function useAddTagToPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { postId: string; tagName: string }) =>
      graphqlClient.request(AddTagToPostDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['postsByTag'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}
