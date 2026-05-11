import { createComment, findManyComments } from '../generated/comment.crud.js'
import { findUniquePost } from '../generated/post.crud.js'

export async function addComment(postId: string, authorId: string, body: string) {
  if (!body.trim()) {
    throw new Error('Comment body cannot be empty')
  }

  const post = await findUniquePost({ id: postId })
  if (!post) {
    throw new Error('Post not found')
  }
  if (!post.published) {
    throw new Error('Cannot comment on unpublished posts')
  }

  return createComment({
    body: body.trim(),
    post: { connect: { id: postId } },
    author: { connect: { id: authorId } },
  })
}

export async function getCommentsForPost(postId: string) {
  return findManyComments({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  })
}
