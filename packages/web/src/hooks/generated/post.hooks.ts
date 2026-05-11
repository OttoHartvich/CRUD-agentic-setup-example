// Auto-generated — DO NOT EDIT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../../lib/graphql-client'
import {
  GetPostDocument,
  CountPostsDocument,
  UpdatePostDocument,
  type UpdatePostMutationVariables,
} from '../../gql/graphql'

const listKey = ['posts'] as const
const countKey = ['postsCount'] as const
const singleKey = (id: string) => ['post', id] as const

export function useGetPost(id: string) {
  return useQuery({
    queryKey: singleKey(id),
    queryFn: () => graphqlClient.request(GetPostDocument, { id }),
    enabled: Boolean(id),
  })
}

export function useCountPosts() {
  return useQuery({
    queryKey: countKey,
    queryFn: () => graphqlClient.request(CountPostsDocument),
  })
}

export function useUpdatePost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: UpdatePostMutationVariables) =>
      graphqlClient.request(UpdatePostDocument, vars),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: singleKey(vars.id) })
    },
  })
}
