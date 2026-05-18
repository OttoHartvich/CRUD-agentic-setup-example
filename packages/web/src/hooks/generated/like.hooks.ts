// Auto-generated — DO NOT EDIT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../../lib/graphql-client'
import {
  GetLikeDocument,
  ListLikesDocument,
  CountLikesDocument,
  CreateLikeDocument,
  type CreateLikeMutationVariables,
  UpdateLikeDocument,
  type UpdateLikeMutationVariables,
  DeleteLikeDocument,
  type DeleteLikeMutationVariables,
} from '../../gql/graphql'

const listKey = ['likes'] as const
const countKey = ['likesCount'] as const
const singleKey = (id: string) => ['like', id] as const

export function useGetLike(id: string) {
  return useQuery({
    queryKey: singleKey(id),
    queryFn: () => graphqlClient.request(GetLikeDocument, { id }),
    enabled: Boolean(id),
  })
}

export function useListLikes() {
  return useQuery({
    queryKey: listKey,
    queryFn: () => graphqlClient.request(ListLikesDocument),
  })
}

export function useCountLikes() {
  return useQuery({
    queryKey: countKey,
    queryFn: () => graphqlClient.request(CountLikesDocument),
  })
}

export function useCreateLike() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: CreateLikeMutationVariables) =>
      graphqlClient.request(CreateLikeDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}

export function useUpdateLike() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: UpdateLikeMutationVariables) =>
      graphqlClient.request(UpdateLikeDocument, vars),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: singleKey(vars.id) })
    },
  })
}

export function useDeleteLike() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: DeleteLikeMutationVariables) =>
      graphqlClient.request(DeleteLikeDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}
