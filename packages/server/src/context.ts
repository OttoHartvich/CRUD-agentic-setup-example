import { prisma } from '@mock/db'

export interface GraphQLContext {
  currentUserId: string
}

// Mock context — in production this would come from auth middleware.
// For the demo we resolve `currentUserId` to the first AUTHOR-or-ADMIN user
// at request time so authored-only mutations (createPost, addTagToPost, etc.)
// succeed against seeded data without an auth layer.
let cachedUserId: string | null = null

export async function createContext(request?: Request): Promise<GraphQLContext> {
  const override = request?.headers.get('x-user-id')
  if (override) return { currentUserId: override }

  if (!cachedUserId) {
    const user = await prisma.user.findFirst({
      where: { role: { in: ['ADMIN', 'AUTHOR'] } },
      orderBy: { createdAt: 'asc' },
    })
    if (!user) {
      throw new Error('No ADMIN or AUTHOR user found — run `npm run db:seed`')
    }
    cachedUserId = user.id
  }

  return { currentUserId: cachedUserId }
}
