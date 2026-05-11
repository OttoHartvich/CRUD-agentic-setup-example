import {
  findManyPosts,
  findUniquePost,
  updatePost,
} from '../generated/post.crud.js'
import { findUniqueTag } from '../generated/tag.crud.js'
import { findUniqueUser } from '../generated/user.crud.js'

async function assertCanTagPost(
  postId: string,
  requestingUserId: string
): Promise<void> {
  const post = await findUniquePost({ id: postId })
  if (!post) {
    throw new Error('Post not found')
  }

  const user = await findUniqueUser({ id: requestingUserId })
  if (!user) {
    throw new Error('User not found')
  }

  if (post.authorId !== requestingUserId && user.role !== 'ADMIN') {
    throw new Error('Not authorized to tag this post')
  }
}

export async function addTagToPost(
  postId: string,
  tagName: string,
  requestingUserId: string
) {
  const trimmed = tagName.trim()
  if (!trimmed) {
    throw new Error('Tag name cannot be empty')
  }

  await assertCanTagPost(postId, requestingUserId)

  return updatePost(
    { id: postId },
    {
      tags: {
        connectOrCreate: {
          where: { name: trimmed },
          create: { name: trimmed },
        },
      },
    }
  )
}

export async function removeTagFromPost(
  postId: string,
  tagName: string,
  requestingUserId: string
) {
  const trimmed = tagName.trim()
  if (!trimmed) {
    throw new Error('Tag name cannot be empty')
  }

  await assertCanTagPost(postId, requestingUserId)

  const tag = await findUniqueTag({ name: trimmed })
  if (!tag) {
    throw new Error('Tag not found')
  }

  return updatePost(
    { id: postId },
    { tags: { disconnect: { id: tag.id } } }
  )
}

export async function findPostsByTag(tagName: string) {
  return findManyPosts({
    where: { tags: { some: { name: tagName } } },
    orderBy: { createdAt: 'desc' },
    include: { author: true, tags: true },
  })
}
