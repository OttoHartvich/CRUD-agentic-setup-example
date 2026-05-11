// Auto-generated — DO NOT EDIT
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../../lib/graphql-client'
import {
  GetUserDocument,
  ListUsersDocument,
  CountUsersDocument,
  CreateUserDocument,
  type CreateUserMutationVariables,
  UpdateUserDocument,
  type UpdateUserMutationVariables,
  DeleteUserDocument,
  type DeleteUserMutationVariables,
} from '../../gql/graphql'

const listKey = ['users'] as const
const countKey = ['usersCount'] as const
const singleKey = (id: string) => ['user', id] as const

export function useGetUser(id: string) {
  return useQuery({
    queryKey: singleKey(id),
    queryFn: () => graphqlClient.request(GetUserDocument, { id }),
    enabled: Boolean(id),
  })
}

export function useListUsers() {
  return useQuery({
    queryKey: listKey,
    queryFn: () => graphqlClient.request(ListUsersDocument),
  })
}

export function useCountUsers() {
  return useQuery({
    queryKey: countKey,
    queryFn: () => graphqlClient.request(CountUsersDocument),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: CreateUserMutationVariables) =>
      graphqlClient.request(CreateUserDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: UpdateUserMutationVariables) =>
      graphqlClient.request(UpdateUserDocument, vars),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: singleKey(vars.id) })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (vars: DeleteUserMutationVariables) =>
      graphqlClient.request(DeleteUserDocument, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: countKey })
    },
  })
}
