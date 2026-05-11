import { createUser, findManyUsers, findUniqueUser } from '../generated/user.crud.js'
import type { Prisma } from '@prisma/client'

export async function registerUser(data: Prisma.UserCreateInput) {
  const existing = await findUniqueUser({ email: data.email })
  if (existing) {
    throw new Error('A user with this email already exists')
  }
  return createUser(data)
}

export async function getUser(id: string) {
  const user = await findUniqueUser({ id })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export async function listUsers() {
  return findManyUsers({ orderBy: { createdAt: 'desc' } })
}
