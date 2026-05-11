import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql-client'
import { PublishPostDocument } from '../gql/graphql'

export function usePublishPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      graphqlClient.request(PublishPostDocument, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
