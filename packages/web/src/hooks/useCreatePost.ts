import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { CreatePostDocument } from '../gql/graphql'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: { title: string; content: string }) =>
      graphqlClient.request(CreatePostDocument, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
