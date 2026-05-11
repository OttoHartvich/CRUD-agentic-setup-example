import {
  createPost,
  findManyPosts,
  findUniquePost,
  updatePost,
  deletePost,
} from '../generated/post.crud.js'
import { findUniqueUser } from '../generated/user.crud.js'
import type { Prisma } from '@prisma/client'

export async function createNewPost(
  authorId: string,
  data: { title: string; content: string }
) {
  const author = await findUniqueUser({ id: authorId })
  if (!author || author.role === 'READER') {
    throw new Error('Not authorized to create posts')
  }
  return createPost({
    title: data.title,
    content: data.content,
    author: { connect: { id: authorId } },
  })
}

export async function publishPost(postId: string, requestingUserId: string) {
  const post = await findUniquePost({ id: postId })
  if (!post) {
    throw new Error('Post not found')
  }

  const user = await findUniqueUser({ id: requestingUserId })
  if (!user) {
    throw new Error('User not found')
  }

  if (post.authorId !== requestingUserId && user.role !== 'ADMIN') {
    throw new Error('Not authorized to publish this post')
  }

  return updatePost({ id: postId }, { published: true })
}

export async function getUserFeed(filters?: { published?: boolean }) {
  const where: Prisma.PostWhereInput = {}
  if (filters?.published !== undefined) {
    where.published = filters.published
  }
  return findManyPosts({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: true, comments: { include: { author: true } } },
  })
}

export async function getPost(id: string) {
  const post = await findUniquePost({ id })
  if (!post) {
    throw new Error('Post not found')
  }
  return post
}

export async function removePost(postId: string, requestingUserId: string) {
  const post = await findUniquePost({ id: postId })
  if (!post) {
    throw new Error('Post not found')
  }

  const user = await findUniqueUser({ id: requestingUserId })
  if (!user) {
    throw new Error('User not found')
  }

  if (post.authorId !== requestingUserId && user.role !== 'ADMIN') {
    throw new Error('Not authorized to delete this post')
  }

  return deletePost({ id: postId })
}
