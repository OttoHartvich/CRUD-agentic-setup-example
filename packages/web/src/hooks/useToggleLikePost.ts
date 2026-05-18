import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { ToggleLikePostDocument } from '../gql/graphql'

export function useToggleLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) =>
      graphqlClient.request(ToggleLikePostDocument, { postId }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['postsByTag'] })
      queryClient.invalidateQueries({ queryKey: ['post'] })
    },
  })
}
