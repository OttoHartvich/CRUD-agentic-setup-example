import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { AddCommentDocument } from '../gql/graphql'

export function useAddComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { postId: string; body: string }) =>
      graphqlClient.request(AddCommentDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}
