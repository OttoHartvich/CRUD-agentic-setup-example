// Auto-generated — DO NOT EDIT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../../lib/graphql-client'
import {
  GetTagDocument,
  ListTagsDocument,
  CountTagsDocument,
  CreateTagDocument,
  type CreateTagMutationVariables,
  UpdateTagDocument,
  type UpdateTagMutationVariables,
  DeleteTagDocument,
  type DeleteTagMutationVariables,
} from '../../gql/graphql'

const listKey = ['tags'] as const
const countKey = ['tagsCount'] as const
const singleKey = (id: string) => ['tag', id] as const

export function useGetTag(id: string) {
  return useQuery({
    queryKey: singleKey(id),
    queryFn: () => graphqlClient.request(GetTagDocument, { id }),
    enabled: Boolean(id),
  })
}

export function useListTags() {
  return useQuery({
    queryKey: listKey,
    queryFn: () => graphqlClient.request(ListTagsDocument),
  })
}

export function useCountTags() {
  return useQuery({
    queryKey: countKey,
    queryFn: () => graphqlClient.request(CountTagsDocument),
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: CreateTagMutationVariables) =>
      graphqlClient.request(CreateTagDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}

export function useUpdateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: UpdateTagMutationVariables) =>
      graphqlClient.request(UpdateTagDocument, vars),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: singleKey(vars.id) })
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: DeleteTagMutationVariables) =>
      graphqlClient.request(DeleteTagDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}
