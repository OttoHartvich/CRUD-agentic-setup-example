// Auto-generated — DO NOT EDIT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../../lib/graphql-client'
import {
  GetCommentDocument,
  ListCommentsDocument,
  CountCommentsDocument,
  CreateCommentDocument,
  type CreateCommentMutationVariables,
  UpdateCommentDocument,
  type UpdateCommentMutationVariables,
  DeleteCommentDocument,
  type DeleteCommentMutationVariables,
} from '../../gql/graphql'

const listKey = ['comments'] as const
const countKey = ['commentsCount'] as const
const singleKey = (id: string) => ['comment', id] as const

export function useGetComment(id: string) {
  return useQuery({
    queryKey: singleKey(id),
    queryFn: () => graphqlClient.request(GetCommentDocument, { id }),
    enabled: Boolean(id),
  })
}

export function useListComments() {
  return useQuery({
    queryKey: listKey,
    queryFn: () => graphqlClient.request(ListCommentsDocument),
  })
}

export function useCountComments() {
  return useQuery({
    queryKey: countKey,
    queryFn: () => graphqlClient.request(CountCommentsDocument),
  })
}

export function useCreateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: CreateCommentMutationVariables) =>
      graphqlClient.request(CreateCommentDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}

export function useUpdateComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: UpdateCommentMutationVariables) =>
      graphqlClient.request(UpdateCommentDocument, vars),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: singleKey(vars.id) })
    },
  })
}

export function useDeleteComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: DeleteCommentMutationVariables) =>
      graphqlClient.request(DeleteCommentDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}
